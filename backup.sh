#!/bin/bash

mkdir -p /home/sylvain/local/portage/d2_racing_overlay/Funbox
mkdir -p /home/sylvain/local/portage/d2_racing_overlay/Funbox/boot

time rsync -aHA  --del --force --stats --progress /etc/portage/package.use    /home/sylvain/local/portage/d2_racing_overlay/Funbox/portage

time rsync -aHA  --del --force --stats --progress /etc/portage/package.mask   /home/sylvain/local/portage/d2_racing_overlay/Funbox/portage

time rsync -aHA  --del --force --stats --progress /etc/portage/package.unmask /home/sylvain/local/portage/d2_racing_overlay/Funbox/portage

ln -fn /etc/portage/package.license /home/sylvain/local/portage/d2_racing_overlay/Funbox/portage/package.license

time rsync -aHA  --del --force --stats --progress /etc/X11/xorg.conf.d/ /home/sylvain/local/portage/d2_racing_overlay/Funbox/xorg.conf.d

cp -a /boot/grub/grub.cfg /home/sylvain/local/portage/d2_racing_overlay/Funbox/boot/
cp -a /boot/config* /home/sylvain/local/portage/d2_racing_overlay/Funbox/boot/
cp -a /boot/System* /home/sylvain/local/portage/d2_racing_overlay/Funbox/boot/


time rsync -aHA  --del --force --stats --progress /home/sylvain/Images/ /home/sylvain/local/portage/d2_racing_overlay/Images 

time rsync -aHA  --del --force --stats --progress /home/sylvain/Config_KDE/ /home/sylvain/local/portage/d2_racing_overlay/Config_KDE 
time rsync -aHA  --del --force --stats --progress /home/sylvain/Config_KDE/ /home/sylvain/local/portage/d2_racing_overlay/Config_Razor-qt 
time rsync -aHA  --del --force --stats --progress /home/sylvain/Config_KDE/ /home/sylvain/local/portage/d2_racing_overlay/Config_Xfce 


time rsync -aHA  --del --force --stats --progress /home/sylvain/Config_Openbox/ /home/sylvain/local/portage/d2_racing_overlay/Config_Openbox 

time rsync -aHA  --del --force --stats --progress /home/sylvain/.config/openbox/ /home/sylvain/local/portage/d2_racing_overlay/Config_Openbox/openbox  

ln -fn /home/sylvain/.Xdefaults  /home/sylvain/local/portage/d2_racing_overlay/Config_Openbox/Xdefaults

ln -fn /home/sylvain/.conkyrc /home/sylvain/local/portage/d2_racing_overlay/Config_Openbox/conkyrc

ln -fn /home/sylvain/.wbar /home/sylvain/local/portage/d2_racing_overlay/Config_Openbox/wbar

ln -fn /etc/slim.conf /home/sylvain/local/portage/d2_racing_overlay/Config_Openbox/slim.conf

ln -fn /home/sylvain/86-hpmud-hp_laserjet_p1505.rules /home/sylvain/local/portage/d2_racing_overlay/Funbox/86-hpmud-hp_laserjet_p1505.rules

ln -fn /etc/make.conf /home/sylvain/local/portage/d2_racing_overlay/Funbox/make.conf

ln -fn /etc/fstab /home/sylvain/local/portage/d2_racing_overlay/Funbox/fstab

ln -fn /etc/boot.conf /home/sylvain/local/portage/d2_racing_overlay/Funbox/boot.conf

ln -fn /etc/pam.d/system-login  /home/sylvain/local/portage/d2_racing_overlay/Funbox/system-login

ln -fn /var/lib/portage/world  /home/sylvain/local/portage/d2_racing_overlay/Funbox/world

