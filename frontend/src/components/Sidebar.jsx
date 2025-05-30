import { Box, Tabs, Tab } from "@mui/material";

function Sidebar({ tab, setTab }) {
  return (
    <Box sx={{ mb: 4, borderBottom: 1, borderColor: "divider" }}>
      <Tabs
        value={tab}
        onChange={(e, newValue) => setTab(newValue)}
        sx={{ "& .MuiTabs-flexContainer": { justifyContent: "flex-start" } }}
      >
        <Tab label="Services" />
        <Tab label="Profile" />
      </Tabs>
    </Box>
  );
}

export default Sidebar;