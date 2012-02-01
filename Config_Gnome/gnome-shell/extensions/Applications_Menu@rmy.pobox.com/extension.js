// Copyright (C) 2011 R M Yorston
// Licence: GPLv2+

const Clutter = imports.gi.Clutter;
const Gio = imports.gi.Gio;
const GLib = imports.gi.GLib;
const GMenu = imports.gi.GMenu;
const Lang = imports.lang;
const Shell = imports.gi.Shell;
const St = imports.gi.St;

const Layout = imports.ui.layout;
const Main = imports.ui.main;
const ModalDialog = imports.ui.modalDialog;
const PanelMenu = imports.ui.panelMenu;
const PopupMenu = imports.ui.popupMenu;

const _ = imports.gettext.domain('gnome-shell').gettext;
const _f = imports.gettext.domain('frippery-applications-menu').gettext;

const SETTINGS_FILE = ".frippery_appm";
const TLC_MASK =   1<<0;
const ICON_MASK =  1<<1;
const LABEL_MASK = 1<<2;
const V2_MASK =    1<<3;
const MAX_MASK =  (1<<4)-1;
const DEFAULT_MASK = TLC_MASK|ICON_MASK|LABEL_MASK|V2_MASK;

function ApplicationMenuItem(app, params) {
    this._init(app, params);
}

ApplicationMenuItem.prototype = {
    __proto__: PopupMenu.PopupBaseMenuItem.prototype,

    _init: function(app, params) {
        PopupMenu.PopupBaseMenuItem.prototype._init.call(this, params);

        let box = new St.BoxLayout({ name: 'applicationMenuBox',
                                     style_class: 'applications-menu-item-box'});
        this.addActor(box);

        let icon = app.create_icon_texture(24);
        box.add(icon);

        let label = new St.Label({ text: app.get_name() });
        box.add(label);

        this.app = app;

        this.connect('activate', Lang.bind(this, function() {
            let id = this.app.get_id();
            let app = Shell.AppSystem.get_default().lookup_app(id);
            app.open_new_window(-1);
        }));
    }
};

function ToggleSwitch(state) {
    this._init(state);
}

ToggleSwitch.prototype = {
    __proto__: PopupMenu.Switch.prototype,

    _init: function(state) {
        PopupMenu.Switch.prototype._init.call(this, state);

        this.actor.can_focus = true;
        this.actor.reactive = true;
        this.actor.add_style_class_name("applications-menu-toggle-switch");

        this.actor.connect('button-release-event',
                Lang.bind(this, this._onButtonReleaseEvent));
        this.actor.connect('key-press-event',
                Lang.bind(this, this._onKeyPressEvent));
        this.actor.connect('key-focus-in',
                Lang.bind(this, this._onKeyFocusIn));
        this.actor.connect('key-focus-out',
                Lang.bind(this, this._onKeyFocusOut));
    },

    _onButtonReleaseEvent: function(actor, event) {
        this.toggle();
        return true;
    },

    _onKeyPressEvent: function(actor, event) {
        let symbol = event.get_key_symbol();

        if (symbol == Clutter.KEY_space || symbol == Clutter.KEY_Return) {
            this.toggle();
            return true;
        }

        return false;
    },

    _onKeyFocusIn: function(actor) {
        actor.add_style_pseudo_class('active');
    },

    _onKeyFocusOut: function(actor) {
        actor.remove_style_pseudo_class('active');
    },

    getState: function() {
        return this.state;
    }
};

function ShowHideSwitch(item, state) {
    this._init(item, state);
}

ShowHideSwitch.prototype = {
    __proto__: ToggleSwitch.prototype,

    _init: function(item, state) {
        ToggleSwitch.prototype._init.call(this, state);

        this.item = item;
    },

    toggle: function() {
        ToggleSwitch.prototype.toggle.call(this);

        if ( this.state ) {
            this.item.show();
        }
        else {
            this.item.hide();
        }
    }
};

function ApplicationsMenuDialog(button) {
    this._init(button);
}

ApplicationsMenuDialog.prototype = {
    __proto__: ModalDialog.ModalDialog.prototype,

    _init: function(button) {
        ModalDialog.ModalDialog.prototype._init.call(this,
                    { styleClass: 'applications-menu-dialog' });

        this.button = button;

        let table = new St.Table({homogeneous: false, reactive: true,
                              styleClass: 'applications-menu-dialog-table'});
        this.contentLayout.add(table, { y_align: St.Align.START });

        let label = new St.Label(
                        { style_class: 'applications-menu-dialog-label',
                          text: _f('Icon') });
        table.add(label, { row: 0, col: 0 });

        this.iconSwitch = new ShowHideSwitch(button._iconBox, true);
        table.add(this.iconSwitch.actor, { row: 0, col: 1 });

        label = new St.Label(
                        { style_class: 'applications-menu-dialog-label',
                          text: _f('Text') });
        table.add(label, { row: 1, col: 0 });

        this.labelSwitch = new ShowHideSwitch(button._label, true);
        table.add(this.labelSwitch.actor, { row: 1, col: 1 });

        label = new St.Label({ style_class: 'applications-menu-dialog-label',
                        text: _f('Hot corner') });
        table.add(label, { row: 2, col: 0 });

        this.tlcSwitch = new ShowHideSwitch(button._hotCorner.actor, true);
        table.add(this.tlcSwitch.actor, { row: 2, col: 1 });

        let buttons = [{ action: Lang.bind(this, this.close),
                         label:  _f("Close"),
                         key:    Clutter.Return }];

        this.setButtons(buttons);

        this._actionKeys[Clutter.Escape] = Lang.bind(this, this.close);
    },

    open: function() {
        let settings = this.button.getSettings();

        let state = (settings&ICON_MASK) != 0;
        this.iconSwitch.setToggleState(state);

        let state = (settings&LABEL_MASK) != 0;
        this.labelSwitch.setToggleState(state);

        state = (settings&TLC_MASK) != 0;
        this.tlcSwitch.setToggleState(state);

        ModalDialog.ModalDialog.prototype.open.call(this,
                global.get_current_time());
    },

    close: function() {
        let settings = V2_MASK;
        if ( this.iconSwitch.getState() ) {
            settings |= ICON_MASK;
        }

        if ( this.labelSwitch.getState() ) {
            settings |= LABEL_MASK;
        }

        if ( this.tlcSwitch.getState() ) {
            settings |= TLC_MASK;
        }

        if ( settings != this.button.getSettings() ) {
            this.button.setSettings(settings);
            let settingsFilePath = GLib.get_home_dir() + '/' + SETTINGS_FILE;
            let settingsFile = Gio.file_new_for_path(settingsFilePath);
            settingsFile.replace_contents(settings+'\n', null, false, 0, null);
        }

        ModalDialog.ModalDialog.prototype.close.call(this,
                global.get_current_time());
    }
};

function ApplicationsMenuButton() {
    this._init();
}

ApplicationsMenuButton.prototype = {
    __proto__: PanelMenu.Button.prototype,

    _init: function() {
        PanelMenu.Button.prototype._init.call(this, 0.0);

        this.settings = DEFAULT_MASK;

        let settingsFilePath = GLib.get_home_dir() + '/' + SETTINGS_FILE;
        let settingsFile = Gio.file_new_for_path(settingsFilePath);
        if ( settingsFile.query_exists(null) ) {
            let [flag, str] = settingsFile.load_contents(null);
            if ( flag ) {
                let iset = parseInt(str);
                if ( !isNaN(iset) && iset >= 0 && iset <= MAX_MASK ) {
                    this.settings = iset;

                    // version 1 settings didn't include label
                    if ( (this.settings&V2_MASK) == 0 ) {
                        this.settings |= LABEL_MASK;
                    }
                }
            }
        }

        let container = new Shell.GenericContainer();
        container.connect('get-preferred-width', Lang.bind(this, this._containerGetPreferredWidth));
        container.connect('get-preferred-height', Lang.bind(this, this._containerGetPreferredHeight));
        container.connect('allocate', Lang.bind(this, this._containerAllocate));
        this.actor.add_actor(container);

        this._box = new St.BoxLayout();

        this._iconBox = new St.Bin();
        this._box.add(this._iconBox, { y_align: St.Align.MIDDLE, y_fill: false });

        let logo = new St.Icon({ icon_name: 'start-here',
                                 icon_type: St.IconType.FULLCOLOR,
                                 style_class: 'applications-menu-button-icon'});
        this._iconBox.child = logo;

        let label = new St.Label({ text: " " });
        this._box.add(label, { y_align: St.Align.MIDDLE, y_fill: false });

        this._label = new St.Label({ text: _("Applications") });
        this._box.add(this._label, { y_align: St.Align.MIDDLE, y_fill: false });
        container.add_actor(this._box);

        this._hotCorner = new Layout.HotCorner();
        this._hotCorner._hideRipples();
        container.add_actor(this._hotCorner.actor);

        if ( (this.settings&ICON_MASK) == 0 ) {
            this._iconBox.hide();
        }

        if ( (this.settings&LABEL_MASK) == 0 ) {
            this._label.hide();
        }

        if ( (this.settings&TLC_MASK) == 0 ) {
            this._hotCorner.actor.hide();
        }

        this._appSystem = Shell.AppSystem.get_default();
        this._appSystem.connect('installed-changed', Lang.bind(this, this._rebuildMenu));

        this._buildMenu();

        this.actor.connect('button-release-event',
                    Lang.bind(this, this._showDialog));
    },

    // stolen from panel.js
    _containerGetPreferredWidth: function(actor, forHeight, alloc) {
        [alloc.min_size, alloc.natural_size] = this._box.get_preferred_width(forHeight);
    },

    _containerGetPreferredHeight: function(actor, forWidth, alloc) {
        [alloc.min_size, alloc.natural_size] = this._box.get_preferred_height(forWidth);
    },

    _containerAllocate: function(actor, box, flags) {
        this._box.allocate(box, flags);

        // The hot corner needs to be outside any padding/alignment
        // that has been imposed on us
        let primary = Main.layoutManager.primaryMonitor;
        let hotBox = new Clutter.ActorBox();
        let ok, x, y;
        if (actor.get_direction() == St.TextDirection.LTR) {
            [ok, x, y] = actor.transform_stage_point(primary.x, primary.y);
        } else {
            [ok, x, y] = actor.transform_stage_point(primary.x + primary.width, primary.y);
            // hotCorner.actor has northeast gravity, so we don't need
            // to adjust x for its width
        }

        hotBox.x1 = Math.round(x);
        hotBox.x2 = hotBox.x1 + this._hotCorner.actor.width;
        hotBox.y1 = Math.round(y);
        hotBox.y2 = hotBox.y1 + this._hotCorner.actor.height;
        this._hotCorner.actor.allocate(hotBox, flags);
    },

    // Stolen from appDisplay.js
    _loadCategory: function(dir, appList) {
        var iter = dir.iter();
        var nextType;
        while ((nextType = iter.next()) != GMenu.TreeItemType.INVALID) {
            if (nextType == GMenu.TreeItemType.ENTRY) {
                var entry = iter.get_entry();
                var app = this._appSystem.lookup_app_by_tree_entry(entry);
                if (!entry.get_app_info().get_nodisplay())
                    appList.push(app);
            } else if (nextType == GMenu.TreeItemType.DIRECTORY) {
                if (!dir.get_is_nodisplay())
                    this._loadCategory(iter.get_directory(), appList);
            }
        }
    },

    _buildSections: function() {
        // Stolen from appDisplay.js
        var tree = this._appSystem.get_tree();
        var root = tree.get_root_directory();

        var iter = root.iter();
        var nextType;
        var i = 0;

        var sections = [];
        while ((nextType = iter.next()) != GMenu.TreeItemType.INVALID) {
            if (nextType == GMenu.TreeItemType.DIRECTORY) {
                var dir = iter.get_directory();
                if (dir.get_is_nodisplay())
                    continue;
                var appList = [];
                this._loadCategory(dir, appList);
                sections.push({ name: dir.get_name(),
                                apps: appList });
                i++;
            }
        }

        return sections;
    },

    _buildMenu: function() {
        let sections = this._buildSections();
        for ( let i=0; i<sections.length; ++i ) {
            let section = sections[i];
            let submenu = new PopupMenu.PopupSubMenuMenuItem(section.name);
            this.menu.addMenuItem(submenu);

            for ( let j=0; j<section.apps.length; ++j ) {
                let app = section.apps[j];
                let menuItem = new ApplicationMenuItem(app);

                submenu.menu.addMenuItem(menuItem, j);
            }
	}
    },

    _rebuildMenu: function() {
        this.menu.removeAll();
        this._buildMenu();
    },

    _showDialog: function(actor, event) {
        let button = event.get_button();
        if ( button == 3 ) {
            if ( this._applicationsMenuDialog == null ) {
                this._applicationsMenuDialog = new ApplicationsMenuDialog(this);
            }
            this._applicationsMenuDialog.open();
            return true;
        }
        return false;
    },

    getSettings: function() {
        return this.settings;
    },

    setSettings: function(settings) {
        this.settings = settings;
    },

    enable: function() {
        Main.panel._leftBox.remove_actor(Main.panel._activities);
        Main.panel._activitiesButton._hotCorner._hideRipples();
        Main.panel._leftBox.insert_actor(this.actor, 0);
        Main.panel._menus.addMenu(this.menu);
    },

    disable: function() {
        Main.panel._menus.removeMenu(this.menu);
        Main.panel._leftBox.remove_actor(this.actor);
        Main.panel._leftBox.insert_actor(Main.panel._activities, 0);
    }
};

function init(extensionMeta) {
    let localePath = extensionMeta.path + '/locale';
    imports.gettext.bindtextdomain('frippery-applications-menu', localePath);

    Layout.HotCorner.prototype._hideRipples = function() {
        this._ripple1.hide();
        this._ripple2.hide();
        this._ripple3.hide();
    };

    return new ApplicationsMenuButton();
}
