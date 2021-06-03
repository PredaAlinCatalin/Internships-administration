import { createSlice, createAsyncThunk, createSelector } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  items: [],
  status: "idle",
  error: null,
};

export const fetchCompanies = createAsyncThunk("companies/fetchCompanies", async () => {
  const response = await axios.get("api/companies");
  return response.data;
});

export const updateCompany = createAsyncThunk(
  "companies/updateCompany",
  async (company) => {
    const response = await axios.put("api/companies/" + company.id, company);
    return company;
  }
);

const companiesSlice = createSlice({
  name: "companies",
  initialState,
  reducers: {},
  extraReducers: {
    [fetchCompanies.pending]: (state, action) => {
      state.status = "loading";
    },
    [fetchCompanies.fulfilled]: (state, action) => {
      state.status = "succeeded";
      state.items = state.items.concat(action.payload);
    },
    [fetchCompanies.rejected]: (state, action) => {
      state.status = "failed";
      state.error = action.payload;
    },
    [updateCompany.fulfilled]: (state, action) => {
      const existingCompany = state.items.find((item) => item.id === action.payload.id);
      if (existingCompany) {
        existingCompany.name = action.payload.name;
        existingCompany.logoPath = action.payload.logoPath;
        existingCompany.coverPath = action.payload.coverPath;
        existingCompany.description = action.payload.description;
        existingCompany.industry = action.payload.industry;
        existingCompany.address = action.payload.address;
        existingCompany.website = action.payload.website;
      }
    },
  },
});

export default companiesSlice.reducer;

export const selectAllCompanies = (state) => state.companies.items;

export const selectCompanyById = (state, id) =>
  state.companies.items.find((c) => c.id !== undefined && c.id == id);
