#!/bin/bash

time rsync -aHA  --del --force --stats --progress /etc/portage/ /home/sylvain/local/portage/d2_racing_overlay/Funbox/portage

time rsync -aHA  --del --force --stats --progress /etc/X11/xorg.conf.d/ /home/sylvain/local/portage/d2_racing_overlay/Funbox/xorg.conf.d

time rsync -aHA  --del --force --stats --progress /boot/ /home/sylvain/local/portage/d2_racing_overlay/Funbox/boot

time rsync -aHA  --del --force --stats --progress /home/sylvain/Images/ /home/sylvain/local/portage/d2_racing_overlay/Images 

time rsync -aHA  --del --force --stats --progress /home/sylvain/Config_KDE/ /home/sylvain/local/portage/d2_racing_overlay/Config_KDE 

time rsync -aHA  --del --force --stats --progress /home/sylvain/Config_KDE/ /home/sylvain/local/portage/d2_racing_overlay/Config_Xfce 

time rsync -aHA  --del --force --stats --progress /home/sylvain/.config/openbox/ /home/sylvain/local/portage/d2_racing_overlay/openbox  

ln -fn /etc/make.conf /home/sylvain/local/portage/d2_racing_overlay/Funbox/make.conf

ln -fn /home/sylvain/.Xdefaults  /home/sylvain/local/portage/d2_racing_overlay/Funbox/Xdefaults

ln -fn /home/sylvain/.conkyrc /home/sylvain/local/portage/d2_racing_overlay/Funbox/conkyrc

ln -fn /home/sylvain/.wbar /home/sylvain/local/portage/d2_racing_overlay/Funbox/wbar

ln -fn /etc/slim.conf /home/sylvain/local/portage/d2_racing_overlay/Funbox/slim.conf

ln -fn /home/sylvain/86-hpmud-hp_laserjet_p1505.rules /home/sylvain/local/portage/d2_racing_overlay/Funbox/86-hpmud-hp_laserjet_p1505.rules
