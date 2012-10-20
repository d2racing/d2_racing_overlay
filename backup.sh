#!/bin/bash

time rsync -aHA  --del --force --stats --progress /etc/portage/package.use    ~/local/portage/d2_racing_overlay/Genbox/portage

time rsync -aHA  --del --force --stats --progress /etc/portage/package.mask   ~/local/portage/d2_racing_overlay/Genbox/portage

time rsync -aHA  --del --force --stats --progress /etc/portage/package.unmask ~/local/portage/d2_racing_overlay/Genbox/portage

time rsync -aHA  --del --force --stats --progress /etc/portage/package.license  ~/local/portage/d2_racing_overlay/Genbox/portage

time rsync -aHA  --del --force --stats --progress /etc/X11/xorg.conf.d/ ~/local/portage/d2_racing_overlay/Genbox/xorg.conf.d


sudo time rsync -aHA  --del --force --stats --progress /boot/grub2/grub.cfg ~/local/portage/d2_racing_overlay/Genbox/boot

#sudo cp /boot/grub2/grub.cfg ~/local/portage/d2_racing_overlay/Genbox/boot/
#sudo cp /boot/config-* ~/local/portage/d2_racing_overlay/Genbox/boot/
#sudo cp /boot/System.* ~/local/portage/d2_racing_overlay/Genbox/boot/

#cp /etc/fstab ~/local/portage/d2_racing_overlay/Genbox/
#cp /etc/portage/make.conf ~/local/portage/d2_racing_overlay/Genbox/portage/
#sudo cp /var/lib/portage/world ~/local/portage/d2_racing_overlay/Genbox/


#
#
#time rsync -aHA  --del --force --stats --progress ~/Images/ ~/local/portage/d2_racing_overlay/Images 
#
#
#time rsync -aHA  --del --force --stats --progress ~/Config_Gnome/ ~/local/portage/d2_racing_overlay/Config_Gnome
#
#time rsync -aHA  --del --force --stats --progress ~/Config_KDE/ ~/local/portage/d2_racing_overlay/Config_KDE 
#time rsync -aHA  --del --force --stats --progress ~/Config_Razor-qt/ ~/local/portage/d2_racing_overlay/Config_Razor-qt 
#time rsync -aHA  --del --force --stats --progress ~/Config_Xfce/ ~/local/portage/d2_racing_overlay/Config_Xfce 
#
#
# time rsync -aHA  --del --force --stats --progress ~/Config_Openbox/ ~/local/portage/d2_racing_overlay/Config_Openbox 
#
# time rsync -aHA  --del --force --stats --progress ~/.config/openbox/ ~/local/portage/d2_racing_overlay/Config_Openbox/openbox  
#
#ln -fn ~/.Xdefaults  ~/local/portage/d2_racing_overlay/Config_Openbox/Xdefaults
#
#ln -fn ~/.conkyrc ~/local/portage/d2_racing_overlay/Config_Openbox/conkyrc
#
#ln -fn ~/.wbar ~/local/portage/d2_racing_overlay/Config_Openbox/wbar
#
# ln -fn /etc/slim.conf ~/local/portage/d2_racing_overlay/Config_Openbox/slim.conf
#
#ln -fn ~/86-hpmud-hp_laserjet_p1505.rules ~/local/portage/d2_racing_overlay/Funbox/86-hpmud-hp_laserjet_p1505.rules
#
#ln -fn /etc/make.conf ~/local/portage/d2_racing_overlay/Funbox/make.conf
#
#ln -fn /etc/fstab ~/local/portage/d2_racing_overlay/Funbox/fstab
#
#ln -fn /etc/boot.conf ~/local/portage/d2_racing_overlay/Funbox/boot.conf
#
#ln -fn /var/lib/portage/world  ~/local/portage/d2_racing_overlay/Funbox/world
#
#ln -fn /etc/conf.d/modules ~/local/portage/d2_racing_overlay/Funbox/modules
#
#ln -fn ~/sudoers ~/local/portage/d2_racing_overlay/Funbox/sudoers
