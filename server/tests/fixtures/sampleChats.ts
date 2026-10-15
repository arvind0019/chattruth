// Sample synthetic Android WhatsApp export
export const ANDROID_SAMPLE_CHAT = `15/01/2024, 10:15 - Messages and calls are end-to-end encrypted. No one outside of this chat, not even WhatsApp, can read or listen to them.
15/01/2024, 10:16 - Alex: Hey Maya, did you review the project proposal?
15/01/2024, 10:18 - Maya: Yes! I went through all the sections this morning.
It looks comprehensive and very thorough.
15/01/2024, 10:20 - Alex: Great. Are you free to discuss tomorrow afternoon?
15/01/2024, 10:25 - Maya: Tomorrow at 3pm works perfectly for me.
15/01/2024, 10:26 - Alex: Perfect, I will send the invite shortly.`;

// Sample synthetic iOS WhatsApp export (brackets format with AM/PM and seconds)
export const IOS_SAMPLE_CHAT = `[12/02/2024, 08:30:15] Messages and calls are end-to-end encrypted.
[12/02/2024, 08:31:00] Jordan: Good morning Sam! Have you had breakfast yet?
[12/02/2024, 08:35:20] Sam: Morning Jordan! Just making some coffee right now.
[12/02/2024, 08:36:10] Sam: Let me know if you want to grab lunch around noon.
[12/02/2024, 08:40:00] Jordan: Noon sounds great, let's meet by the park cafe.`;

// Synthetic multiline conversation
export const MULTILINE_SAMPLE_CHAT = `10/03/2024, 14:00 - Taylor: Here is the itinerary for our trip:
1. Arrive at terminal 2
2. Catch the shuttle
3. Check into hotel
10/03/2024, 14:05 - Casey: Got it!
I have also packed the camera gear and extra batteries.
See you at the gate.`;

// Malformed text
export const MALFORMED_CHAT = `Random unformatted text without any timestamps or message headers.
Just arbitrary sentences that do not match WhatsApp export syntax.`;
