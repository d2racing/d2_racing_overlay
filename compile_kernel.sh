#!/bin/bash
echo 'montage /boot'
mount /boot

cd /usr/src/linux
echo '/usr/src/linux'
time make -j9 && make modules_install && make install 

echo 'generation du grub.cfg'
grub2-mkconfig -o /boot/grub2/grub.cfg 

echo 'recompilation des dépendances'
emerge @module-rebuild && emerge @x11-module-rebuild

echo 'terminé avec succès'

