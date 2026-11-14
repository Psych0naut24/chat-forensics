export interface SampleChatOption {
  id: string;
  title: string;
  subtitle: string;
  tag: string;
  participants: [string, string];
  content: string;
}

export const SAMPLE_CHATS: SampleChatOption[] = [
  {
    id: 'situationship',
    title: 'The Fading Situationship',
    subtitle: 'From 2 AM banter to 14-hour delayed one-liners',
    tag: 'Classic Drift',
    participants: ['Alex', 'Jordan'],
    content: `[01/06/24, 18:24:12] Alex: Hey! Did you ever end up trying that ramen spot on 4th?
[01/06/24, 18:26:05] Jordan: Omg yes!! It was incredible, the broth was insane. You have to go.
[01/06/24, 18:27:30] Alex: Haha I knew it. We should definitely go together this weekend if you're free?
[01/06/24, 18:28:44] Jordan: I would love that! Saturday night works best for me :)
[01/06/24, 23:15:10] Alex: Still on for Saturday? Also listening to that playlist you sent, track 4 is on repeat
[01/06/24, 23:18:22] Jordan: Track 4 is literally my life soundtrack right now haha. And yes absolutely!
[02/06/24, 01:14:05] Jordan: You still awake?
[02/06/24, 01:15:20] Alex: Yeah! Can't sleep, rewatching Severance.
[02/06/24, 01:16:11] Jordan: No way, that finale gave me trust issues for weeks lmao
[02/06/24, 01:45:00] Alex: Okay we need to discuss theories on Saturday then. Goodnight Jordan!
[02/06/24, 01:46:12] Jordan: Goodnight Alex ✨
[08/06/24, 12:10:04] Alex: Saturday was so much fun! The walk by the river was nice.
[08/06/24, 12:45:33] Jordan: Yes had the best time! Such a fun night
[15/06/24, 14:20:10] Alex: Hey! Hope your presentation went well today!
[15/06/24, 20:15:40] Jordan: Hey thanks! It was fine, super exhausted now though.
[15/06/24, 20:18:02] Alex: Rest up! Let me know if you want to grab coffee or hang out this week
[16/06/24, 09:30:15] Jordan: Yeah definitely, super hectic week ahead but will let you know!
[22/06/24, 16:40:11] Alex: Hey Jordan, how was your weekend?
[23/06/24, 11:15:20] Jordan: Hey! Good, just caught up on chores and saw some friends.
[23/06/24, 11:22:04] Alex: Nice! Any chance you're free Thursday? There's an art gallery opening downtown.
[24/06/24, 08:45:30] Jordan: Ah think I might have dinner plans with family that night, rain check?
[24/06/24, 08:48:10] Alex: For sure! Let me know when works for you instead
[29/06/24, 19:12:00] Alex: Hey, saw this meme and immediately thought of your espresso obsession haha
[30/06/24, 15:40:22] Jordan: Haha so true
[04/07/24, 17:30:10] Alex: Hey, everything okay with you? Feel like we haven't properly caught up in a bit
[05/07/24, 14:10:05] Jordan: Hey! Yeah all good just overwhelmed with work and life lately tbh! Hope you're doing well
[05/07/24, 14:15:30] Alex: Totally get it, take care of yourself! Here whenever things calm down.
[05/07/24, 19:02:11] Jordan: Thanks appreciate it!`,
  },
  {
    id: 'onesided',
    title: 'The One-Sided Friendship',
    subtitle: 'High emotional labor meets passive recipient',
    tag: 'Asymmetric Effort',
    participants: ['Sam', 'Taylor'],
    content: `[10/05/24, 09:15:00] Sam: Good morning Taylor! Good luck with the job interview today, you are going to crush it!! 🤞🎉
[10/05/24, 17:45:12] Taylor: Thanks! It was so exhausting. They grilled me for 3 hours straight on system design.
[10/05/24, 17:46:30] Sam: Ugh 3 hours?! That's intense. But honestly your portfolio is unmatched, did you get good vibes from the hiring manager?
[10/05/24, 19:20:00] Taylor: Yeah they seemed nice. Will hear back next Friday.
[10/05/24, 19:22:15] Sam: Fingers crossed for you! We should celebrate with drinks when you get the offer.
[17/05/24, 15:00:20] Sam: Hey! Did you hear back from the recruiter today??
[17/05/24, 16:30:45] Taylor: Got the offer!! Starting in two weeks.
[17/05/24, 16:32:00] Sam: OMG CONGRATULATIONS!! That is huge news! You worked so hard for this, so proud of you!!
[17/05/24, 18:10:15] Taylor: Thanks yeah pretty relieved.
[24/05/24, 12:10:30] Sam: Hey Taylor, are you free this weekend? Was thinking we could grab lunch or go for a hike?
[25/05/24, 10:15:00] Taylor: Hey, busy this weekend prepping for the new role!
[25/05/24, 10:16:45] Sam: No worries at all, totally understand! Next week maybe?
[01/06/24, 14:22:10] Sam: Hey! How was the first week at the new job? Surviving the onboarding?
[01/06/24, 21:05:30] Taylor: It's okay, so much documentation to read. Team is cool though.
[01/06/24, 21:08:12] Sam: That's awesome. I actually just got promoted to senior lead at my firm yesterday too!
[02/06/24, 18:40:00] Taylor: Nice congrats
[10/06/24, 11:30:15] Sam: Hey, you around for a quick phone call sometime? Going through some stressful family stuff, could use a friend's ear
[11/06/24, 16:20:00] Taylor: Hey sorry just seeing this. Trapped in meetings all day. Hope it gets better!`,
  },
  {
    id: 'bestfriends',
    title: 'Balanced Long-Term Best Friends',
    subtitle: 'Mutual reciprocity, zero ego, and seamless rhythm',
    tag: 'Harmonic Bond',
    participants: ['Elena', 'Marcus'],
    content: `[05/04/24, 10:14:02] Elena: Bro look at this dog I saw at the farmer's market. He is wearing shoes.
[05/04/24, 10:14:40] Marcus: LMAO why does he look like he has a 401k and mortgage anxiety
[05/04/24, 10:15:10] Elena: Because he works harder than both of us combined obviously
[05/04/24, 10:15:55] Marcus: Valid. Did you finish the draft for the client deck?
[05/04/24, 10:16:30] Elena: Just pushed it to the shared drive. Take a look and tear it to shreds please.
[05/04/24, 11:30:12] Marcus: Looked at slide 6, honestly brilliant way to frame the metrics. Just fixed a typo on slide 9.
[05/04/24, 11:31:00] Elena: You are a saint. Lunch at the taco truck at 1?
[05/04/24, 11:31:15] Marcus: Already walking there basically. Meet you outside.
[12/04/24, 22:45:10] Marcus: Random question but remember that weird synth wave track we heard at the Berlin festival in 2022?
[12/04/24, 22:46:05] Elena: The one where the DJ looked like Doc Brown from Back to the Future?
[12/04/24, 22:46:33] Marcus: YES EXACTLY THAT ONE
[12/04/24, 22:47:10] Elena: It's 'Resonance' by HOME or the slowed remix. Check Spotify right now.
[12/04/24, 22:48:00] Marcus: DUDE you have a photographic memory for tracks. That's the one!
[19/04/24, 16:20:11] Elena: Hey, got bad news about the pitch. We came in second place.
[19/04/24, 16:21:00] Marcus: Ugh no way. That sucks so bad, you guys put in so much work. You okay?
[19/04/24, 16:22:30] Elena: Stung at first, but client feedback was actually really positive. Just needed more enterprise case studies.
[19/04/24, 16:23:45] Marcus: Honestly their loss. Dinner is on me tonight, no excuses. Picking up Thai food at 7.
[19/04/24, 16:24:10] Elena: Deal. Get the extra spicy noodles!
[19/04/24, 16:24:25] Marcus: You know it 🍜`,
  },
];
