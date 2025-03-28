import { getMoodleBaseUrl } from "./moodle";

interface Event {
  eventType: string;
  eventProperties: any;
}

const sendEvent = async (event: Event & any) => {
  console.log("Sending event:", event);

  const moodleUrl = getMoodleBaseUrl();
  const url = `${moodleUrl}/analytics.php`;

  console.log("Sending event to:", url);

  const { eventType, eventProperties, ...additionalData } = event;

  const payload = {
    eventType,
    eventProperties: {
      ...eventProperties,
      ...additionalData,
      timestamp: Date.now(), //todo this should appear next to eventType, not inside eventProperties
    },
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }
    console.log("Event sent successfully");
  } catch (error) {
    console.log("Error sending event:", error);
  }
};

export function isAnalyticsEvent(data: any): boolean {
  // Add your type guard logic here
  return true;

  // return data && typeof data === 'object' && 'eventType' in data;
}

export { sendEvent };
export type { Event };
