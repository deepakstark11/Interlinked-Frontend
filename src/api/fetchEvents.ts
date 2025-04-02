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
      accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY || "",
      secretAccessKey: import.meta.env.VITE_AWS_SECRET_KEY || "",
    },
  });

/**
 * Determine the EWM number based on event category
 * @param {string} category - Event category or type
 * @param {string} title - Event title, used as fallback
 * @param {string} description - Event description, used as fallback
 * @returns {number} - EWM number (0-22)
 */
function determineEwmNumber(category: string = "", title: string = "", description: string = ""): number {
  // Normalize input strings for consistent matching
  const normalizedCategory = category.toLowerCase();
  const normalizedTitle = title.toLowerCase();
  const normalizedDescription = description.toLowerCase();
  
  // Check all text fields for category matches
  const textToCheck = `${normalizedCategory} ${normalizedTitle} ${normalizedDescription}`;
  
  if (textToCheck.includes("fire") || textToCheck.includes("wildfire") || textToCheck.includes("burn") || textToCheck.includes("flame")) {
    return 0; // Wildfires
  } else if (textToCheck.includes("hurricane") || textToCheck.includes("cyclone") || textToCheck.includes("typhoon")) {
    return 1; // Hurricanes
  } else if (textToCheck.includes("earthquake") || textToCheck.includes("quake") || textToCheck.includes("seismic")) {
    return 2; // Earthquakes
  } else if (textToCheck.includes("tornado") || textToCheck.includes("twister")) {
    return 3; // Tornadoes
  } else if (textToCheck.includes("tsunami") || textToCheck.includes("tidal wave")) {
    return 4; // Tsunamis
  } else if (textToCheck.includes("lightning") || textToCheck.includes("thunderstorm") || textToCheck.includes("thunder")) {
    return 5; // Extreme Lightning/Thunderstorms
  } else if (textToCheck.includes("avalanche") || textToCheck.includes("snow slide")) {
    return 6; // Avalanches
  } else if (textToCheck.includes("landslide") || textToCheck.includes("mudslide")) {
    return 7; // Landslides
  } else if (textToCheck.includes("drought") || textToCheck.includes("dry")) {
    return 8; // Droughts
  } else if (textToCheck.includes("volcanic") || textToCheck.includes("volcano") || textToCheck.includes("eruption")) {
    return 9; // Volcanic Eruptions
  } else if (textToCheck.includes("oil spill") || textToCheck.includes("petroleum")) {
    return 10; // Oil Spills
  } else if (textToCheck.includes("flood") && !textToCheck.includes("flash flood")) {
    return 11; // Flood (Long Term)
  } else if (textToCheck.includes("flash flood")) {
    return 12; // Flash Floods (Short Term)
  } else if (textToCheck.includes("glacier") || textToCheck.includes("ice melt")) {
    return 13; // Glacier Melting
  } else if (textToCheck.includes("ice jam") || textToCheck.includes("frozen")) {
    return 14; // Ice Jams/Frozen Regions
  } else if (textToCheck.includes("pollution") || textToCheck.includes("air quality")) {
    return 15; // Air Quality & Pollution
  } else if (textToCheck.includes("chemical") || textToCheck.includes("radiation") || textToCheck.includes("leak")) {
    return 16; // Chemical Spills/Radiation Leaks
  } else if (textToCheck.includes("geomagnetic") || textToCheck.includes("solar flare")) {
    return 17; // Geomagnetic Storms/Solar Flares
  } else if (textToCheck.includes("heat") || textToCheck.includes("hot")) {
    return 18; // Extreme Heat Events
  } else if (textToCheck.includes("cold") || textToCheck.includes("freeze")) {
    return 19; // Extreme Cold Events
  } else if (textToCheck.includes("severe weather") || textToCheck.includes("storm")) {
    return 20; // Severe Weather Events
  } else if (textToCheck.includes("marine") || textToCheck.includes("ocean") || textToCheck.includes("sea")) {
    return 21; // Marine Events
  } else if (textToCheck.includes("long term") || textToCheck.includes("ongoing")) {
    return 22; // Long Term Events
  }
  
  // Default to earthquake (2) if no match found
  return 2;
}

/**
 * Get an appropriate image for an event based on its EWM number
 * @param {number} ewmNumber - The event type EWM number
 * @returns {string} - Path to the appropriate image
 */
function getEventImage(ewmNumber: number): string {
  switch (ewmNumber) {
    case 0: // Wildfires
      return "/WildfireImage.jpg";
    case 1: // Hurricanes
      return "/HurricaneImage.jpg";
    case 2: // Earthquakes
      return "/ChatsworthEarthquake.jpeg";
    case 3: // Tornadoes
      return "/TornadoImage.jpg";
    case 4: // Tsunamis
      return "/TsunamiImage.jpg";
    case 5: // Extreme Lightning/Thunderstorms
      return "/LightningImage.jpg";
    case 6: // Avalanches
      return "/AvalancheImage.jpg";
    case 7: // Landslides
      return "/LandslideImage.jpg";
    case 8: // Droughts
      return "/DroughtImage.jpg";
    case 9: // Volcanic Eruptions
      return "/VolcanoImage.jpg";
    case 10: // Oil Spills
      return "/OilSpillImage.jpg";
    case 11: // Flood (Long Term)
      return "/FloodImage.jpg";
    case 12: // Flash Floods (Short Term)
      return "/FlashFloodImage.jpg";
    case 13: // Glacier Melting
      return "/GlacierImage.jpg";
    case 14: // Ice Jams/Frozen Regions
      return "/IceJamImage.jpg";
    case 15: // Air Quality & Pollution
      return "/PollutionImage.jpg";
    case 16: // Chemical Spills/Radiation Leaks
      return "/ChemicalSpillImage.jpg";
    case 17: // Geomagnetic Storms/Solar Flares
      return "/SolarFlareImage.jpg";
    case 18: // Extreme Heat Events
      return "/HeatWaveImage.jpg";
    case 19: // Extreme Cold Events
      return "/ColdSnapImage.jpg";
    case 20: // Severe Weather Events
      return "/SevereWeatherImage.jpg";
    case 21: // Marine Events
      return "/MarineEventImage.jpg";
    case 22: // Long Term Events
      return "/LongTermEventImage.jpg";
    default:
      return "/DefaultDisasterImage.jpg";
  }
}

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

          // Determine appropriate ewm_number based on event type
          const eventCategory = event.metadata.type || "";
          const eventTitle = event.metadata.title || "";
          const eventDescription = event.description || "";
          const ewmNumber = determineEwmNumber(eventCategory, eventTitle, eventDescription);

          // Get the appropriate image based on event type
          const eventImage = getEventImage(ewmNumber);

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
            ewm_number: ewmNumber,
            status: event.metadata.status || "UNKNOWN",
            image: eventImage,
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