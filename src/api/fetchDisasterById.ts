import fetchEvents from "./fetchEvents";

/**
 * Fetches a specific disaster event by its unique ID
 * 
 * @param id The unique identifier of the disaster to fetch
 * @returns The disaster data or null if not found
 */
const fetchDisasterById = async (id: string) => {
    try {
      // First, fetch all events
      const allEvents = await fetchEvents(0); // 0 indicates no date filter
      
      // Find the specific event with the matching ID
      const disaster = allEvents.find(event => event.unique_id === id);
      
      return disaster || null;
    } catch (error) {
      console.error(`Error fetching disaster with ID ${id}:`, error);
      throw error;
    }
  };
  
  export default fetchDisasterById;