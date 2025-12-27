import { Box, FormControl, InputLabel, Select, MenuItem } from "@mui/material";

const ApplicationFilters = ({ filters, setFilters, options }) => (
  <Box sx={{ display: "flex", gap: 2, mb: 3, flexWrap: "wrap" }}>
    {options.map((opt) => (
      <FormControl key={opt.name} sx={{ minWidth: 200 }}>
        <InputLabel>{opt.label}</InputLabel>
        <Select
          value={filters[opt.name]}
          onChange={(e) =>
            setFilters({ ...filters, [opt.name]: e.target.value })
          }
        >
          <MenuItem value="">All</MenuItem>
          {opt.values.map((v) => (
            <MenuItem key={v} value={v}>
              {v}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    ))}
  </Box>
);

export default ApplicationFilters;
