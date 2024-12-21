import { supabase } from "@/supabaseClient";// Adjust the path accordingly

export const fetchStartups = async () => {
  try {
    const { data, error } = await supabase
      .from('startups') // Table name in Supabase
      .select('*'); // Fetch all columns

    if (error) {
      console.error('Error fetching startups:', error);
      return [];
    }

    // Map the data to match the Startup interface
    const startups = data.map((startup) => ({
      id: startup.id.toString(),
      image: { uri: startup.logo }, // Assuming logo is a URL
      name: startup.name,
      description: startup.description,
      creator: startup.team_info[0]?.name || 'Unknown', // Assuming team_info is an array
    }));

    return startups;
  } catch (err) {
    console.error('Unexpected error:', err);
    return [];
  }
};
