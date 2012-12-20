#!/bin/bash
#
# Test if TRIM is working on your SSD. Tested only with EXT4 filesystems
# in Ubuntu 11.10 and Fedora 16. This script is simply an automation of
# the procedures described by Nicolay Doytchev here:
#
# https://sites.google.com/site/lightrush/random-1/checkiftrimonext4isenabledandworking
#
# Author: Dorian Bolivar <dbolivar@gmail.com>
# Date: 20120129
#

if [ $# -ne 3 ]; then
	echo
	echo "Usage: $0 <filename> <size> <device>"
	echo
	echo "<filename> is a temporary file for the test"
	echo "<size> is the file size in MB"
	echo "<device> is the device being tested, e.g. /dev/sda"
	echo
	echo "Example: $0 tempfile 5 /dev/sda"
	echo
	echo "This would run the test for /dev/sda creating a"
	echo "temporary file named \"tempfile\" with 5 MB"
	echo
	exit 1
fi

FILE="$1"
SIZE=$2
DEVICE="$3"

# Create the temporary file
dd if=/dev/urandom of="$FILE" count=1 bs=${SIZE}M oflag=direct
sync

# Get the address of the first sector
hdparm --fibmap "$FILE"
SECTOR=`hdparm --fibmap "$FILE" | tail -n1 | awk '{ print $2; }'`

# Read the first sector prior to deletion
hdparm --read-sector $SECTOR "$DEVICE"
echo
echo "This is a sector of the file. It should have been successfully read"
echo "and show a bunch of random data."
echo
read -n 1 -p "Press any key to continue..."

# Delete the file and re-read the sector
rm -f $FILE
sync
echo
echo "File deleted. Sleeping for 120 seconds before re-reading the sector."
echo "If TRIM is working, you should see all 0s now."
sleep 120
hdparm --read-sector $SECTOR "$DEVICE"
echo
echo "If the sector isn't filled with 0s, something is wrong with your"
echo "configuration. Try googling for \"TRIM SSD Linux\"."
echo

exit 0
