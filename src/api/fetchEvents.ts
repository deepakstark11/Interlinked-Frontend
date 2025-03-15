/* ---------------fetchEvents.ts------------ */

/* This function is used for the fetch certain date's event in S3 bucket
 * Please use npm install @aws-sdk/client-s3 before running
 */


import { S3Client, ListObjectsV2Command, GetObjectCommand } from "@aws-sdk/client-s3";
  
const s3 = new S3Client({
    region: import.meta.env.VITE_AWS_REGION || "us-east-2",
    credentials: {
      accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY || "",
      secretAccessKey: import.meta.env.VITE_AWS_SECRET_KEY || "",
    },
  });
  
  export default async function fetchEvents() {
    //console.log("Listing files in S3 bucket...");
  
    try {
      const listCommand = new ListObjectsV2Command({
        Bucket: "historicnosql",
        //Prefix: "USGS Earthquakes/",
      });
  
      const listResponse = await s3.send(listCommand);
      if (!listResponse.Contents) {
        console.error("No files found in the bucket.");
        return [];
      }
  
      //console.log("Found files:", listResponse.Contents.map(obj => obj.Key));
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
  
          return {
            id: event.id,
            title: event.title,
            date: event.date.substring(0, 10),
            location: event.location,
            status: event.metadata.status,
            magnitude: event.metadata.magnitude,
          };
        } catch (error) {
          console.error(`Error fetching ${file.Key}:`, error);
          return null;
        }
      });
        const allEvents = (await Promise.all(fetchFilePromises)).filter(event => event !== null);
        const sevenDaysAgo = new Date();

        // this is filter for the seven date's data, can be changed in the future

        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  
      const filteredEvents = allEvents.filter(event => {
        const eventDate = new Date(event.date);
        return eventDate >= sevenDaysAgo;
      });
  
      //console.log("Successfully fetched and filtered events:", filteredEvents);
      return filteredEvents;
    } catch (error) {
      console.error("Error listing files in S3:", error);
      return [];
    }
  }