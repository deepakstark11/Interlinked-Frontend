/* ---------------fetchEvents.ts------------ */

/* This function is used for the fetch certain date's event in S3 bucket
 * Please use npm install @aws-sdk/client-s3 before running
 */


import { S3Client, ListObjectsV2Command, GetObjectCommand } from "@aws-sdk/client-s3";
  /*
    VITE_AWS_ACCESS_KEY=AKIAQUFLQIGONIUTKWJM
    VITE_AWS_SECRET_KEY=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
    VITE_AWS_REGION=us-east-2
    VITE_S3_BUCKET=historicnosql
    VITE_S3_PREFIX=/
  */
const s3 = new S3Client({
    region: import.meta.env.VITE_AWS_REGION || "us-east-2",
    credentials: {
      accessKeyId: "AKIAQUFLQIGONIUTKWJM",
      secretAccessKey: "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",
    },
  });

  /**
 * Fetch earthquake events from S3 and filter based on date and location.
 * @param {number} daysAgo - Number of days to filter (e.g., 24 hours, 3 days, 7 days)
 * @returns {Promise<DisasterEvent[]>} - List of formatted disaster events
 */
  
  export default async function fetchEvents(daysAgo: number = 7) {
    try {
        const listCommand = new ListObjectsV2Command({
            Bucket: "historicnosql",
        });

    const listResponse = await s3.send(listCommand);
      if (!listResponse.Contents) {
          console.error("No files found in the bucket.");
          return [];
      }
  
      const fetchFilePromises = listResponse.Contents.map(async (file) => {
        if (!file.Key) return null;

        const getCommand = new GetObjectCommand({
            Bucket: "historicnosql",
            Key: file.Key,
        });
  
        try {
          const response = await s3.send(getCommand);
          const data = await response.Body?.transformToString();
          const event = JSON.parse(data || "{}");
          const coordsString = event.metadata.coordinates || "";
          const numericCoords = parseDecimalCoordinates(coordsString);

          // filter for region

          // if (!event.location || !event.location.includes("Canada")) {
          //   return null;
          // }

          const eventDate = new Date(event.date);
          const cutoffDate = new Date();
          cutoffDate.setDate(cutoffDate.getDate() - daysAgo);
          // if (eventDate < cutoffDate) return null;

          return {
            unique_id: event.id || "Unknown ID",
            name: event.metadata.title || "Unnamed Event",
            description: event.description || "No description available.",
            category: event.metadata.type || "Earthquake",
            date_of_occurrence: event.date || "Unknown Date",
            location: event.location || "Unknown Location",
            coordinates: {
              latitude: numericCoords[0] ?? 0,
              longitude: numericCoords[1] ?? 0,
            },
            source: event.source || "USGS Earthquakes",
            event_metadata: event.metadata || {},
            weather_metadata: event.weather || {},
            insights: event.insights || {},
            ewm_number: 2, // Earthquakes are category 2 in EWM
            status: event.metadata.status || "UNKNOWN",
            image: "/ChatsworthEarthquake.jpeg",
        };
      } catch (error) {
        console.error(`Error fetching ${file.Key}:`, error);
        return null;
      }
    });
    const allEvents = (await Promise.all(fetchFilePromises)).filter(event => event !== null);
    return allEvents;
  } catch (error) {
    console.error("Error listing files in S3:", error);
    return [];
  }
}

/**
 * Extract numeric values from a string like:
 * "[Decimal('34.0573333'), Decimal('-118.9003333'), Decimal('12.64')]"
 * Returns e.g. [34.0573333, -118.9003333, 12.64]
 */

function parseDecimalCoordinates(coordsString: string): number[] {
  const pattern = /Decimal\('([^']+)'\)/g;
  const results: number[] = [];

  let match = pattern.exec(coordsString);
  while (match) {
    // match[1] is the numeric portion inside the quotes
    const numericVal = parseFloat(match[1]);
    if (!isNaN(numericVal)) {
      results.push(numericVal);
    }
    match = pattern.exec(coordsString);
  }

  return results;
}