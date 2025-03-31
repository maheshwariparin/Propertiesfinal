// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import { supabase } from "../supabaseClient";

// // Async thunk to fetch properties with a 2-second delay
// export const fetchProperties = createAsyncThunk(
//   "properties/fetchProperties",
//   async (_, { rejectWithValue }) => {
//     try {
//       const { data, error } = await supabase.from("dmhproperties").select("*");
//       if (error) throw error;

//       // Fetch images for each property
//       const propertiesWithImages = await Promise.all(
//         data.map(async (property) => {
//           const imageUrl = await getFirstImageUrl(property.id);
//           return { ...property, imageUrl };
//         })
//       );

//       // 2-second delay
//       await new Promise((resolve) => setTimeout(resolve, 1200));

//       return propertiesWithImages;
//     } catch (err) {
//       return rejectWithValue(err.message);
//     }
//   }
// );

// // Helper function to fetch the first image URL
// const getFirstImageUrl = async (propertyId) => {
//   try {
//     const { data, error } = await supabase.storage
//       .from("property-images")
//       .list(`${propertyId}/images`, { limit: 1, sortBy: { column: "name", order: "asc" } });

//     if (error || !data.length) return null;

//     const filePath = `${propertyId}/images/${data[0].name}`;
//     const { data: urlData } = supabase.storage.from("property-images").getPublicUrl(filePath);
//     return urlData.publicUrl;
//   } catch {
//     return null;
//   }
// };

// // Redux slice
// const propertySlice = createSlice({
//   name: "properties",
//   initialState: {
//     properties: [],
//     localities: [],
//     loading: false,
//     error: null,
//   },
//   reducers: {},
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchProperties.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fetchProperties.fulfilled, (state, action) => {
//         state.loading = false;
//         state.properties = action.payload;
//         state.localities = [...new Set(action.payload.map((p) => p.location?.locality))].filter(Boolean);
//       })
//       .addCase(fetchProperties.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       });
//   },
// });

// export default propertySlice.reducer;




















import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { supabase } from "../supabaseClient";

// Async thunk to fetch properties
export const fetchProperties = createAsyncThunk(
  "properties/fetchProperties",
  async (_, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase.from("dmhproperties").select("*");
      if (error) throw error;

      // Fetch images for each property
      const propertiesWithImages = await Promise.all(
        data.map(async (property) => {
          const imageUrl = await getFirstImageUrl(property.id);
          return { ...property, imageUrl };
        })
      );

      // Optional: Add a delay if needed (remove if unnecessary)
      await new Promise((resolve) => setTimeout(resolve, 1000));

      return propertiesWithImages;
    } catch (err) {
      console.error("Error fetching properties:", err.message);
      return rejectWithValue(err.message);
    }
  }
);

// Helper function to fetch the first image URL
const getFirstImageUrl = async (propertyId) => {
  try {
    const { data, error } = await supabase.storage
      .from("property-images")
      .list(`${propertyId}/images`, { limit: 1, sortBy: { column: "name", order: "asc" } });

    if (error) {
      console.error(`Error fetching images for property ${propertyId}:`, error.message);
      return null;
    }
    if (!data.length) return null;

    const filePath = `${propertyId}/images/${data[0].name}`;
    const { data: urlData } = supabase.storage.from("property-images").getPublicUrl(filePath);
    return urlData?.publicUrl || null;
  } catch (err) {
    console.error(`Error processing image URL for property ${propertyId}:`, err.message);
    return null;
  }
};

// Redux slice
const propertySlice = createSlice({
  name: "properties",
  initialState: {
    properties: [],
    localities: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProperties.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProperties.fulfilled, (state, action) => {
        state.loading = false;
        state.properties = action.payload;
        state.localities = Array.from(
          new Set(
            action.payload
              .map((p) => p.location?.locality?.toUpperCase().trim().replace(/\s+/g, '')) // Convert to uppercase & remove spaces
              .filter(Boolean) // Remove null/undefined values
          )
        ).sort((a, b) => a.localeCompare(b)); // Sort alphabetically
        
         // Sort for consistent order
        
        
      })
      .addCase(fetchProperties.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default propertySlice.reducer;
