#!/bin/bash
# 
# m4a2wav
# 
for i in *.m4a; do
   # out=$(echo $i | sed -e 's/.m4a//g')
    mplayer -ao pcm "$i" -ao pcm:file="${i%.m4a}.wav"
done

for i in *.wav; do
    #out=$(ls $i | sed -e 's/.wav//g')
    #out=$(echo $i | sed -e 's/.wav$//')
    #lame -h -b 192 "$i" "$out.mp3"
    lame -V 0 "$i" "${i%.wav}.mp3"
done

rm *.wav
