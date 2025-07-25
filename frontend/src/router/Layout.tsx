import {
  AppBar,
  Box,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Toolbar,
  Typography,
  useTheme,
  Divider,
} from "@mui/material";
import { NavLink, Outlet } from "react-router-dom";
import { useState } from "react";
// import { AnimatedThemeSwitcher } from "../components/AnimatedThemeSwitcher";
import MenuIcon from "@mui/icons-material/Menu";
import { ThemeButton } from "../components/ThemeButton";

/**
 * A reusable NavLink component styled with theme colors.
 */
const NavItem = ({
  to,
  children,
  onClick,
}: {
  to: string;
  children: React.ReactNode;
  onClick?: () => void; // Optional onClick for closing drawer
}) => {
  const theme = useTheme();
  return (
    <NavLink
      to={to}
      onClick={onClick}
      style={({ isActive }) => ({
        color: isActive
          ? theme.palette.primary.main
          : theme.palette.text.primary,
        textDecoration: "none",
        transition: "color 0.2s ease-in-out",
      })}
    >
      <Typography variant="button" sx={{ fontWeight: "bold" }}>
        {children}
      </Typography>
    </NavLink>
  );
};

const Layout = () => {
  const theme = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };

  const navLinks = [
    { text: "Home", to: "/" },
    { text: "Products", to: "/products" },
  ];

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: "center", p: 2 }}>
      <Typography variant="h6" sx={{ my: 2, fontWeight: 700 }}>
        BAZAAR
      </Typography>
      <Divider />
      <List>
        {navLinks.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              component={NavLink}
              to={item.to}
              sx={{ textAlign: "center" }}
            >
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <>
      <AppBar
        position="static"
        sx={{
          boxShadow: "none",
          borderBottom: `1px solid ${theme.palette.divider}`,
          backgroundColor: theme.palette.background.paper,
        }}
      >
        <Toolbar sx={{ maxWidth: "1380px", width: "100%", mx: "auto" }}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: "none" } }}
          >
            <MenuIcon />
          </IconButton>

          <Typography
            variant="h6"
            color="primary"
            sx={{ fontWeight: 700, flexGrow: { xs: 1, md: 0 } }}
          >
            BAZAAR
          </Typography>

          <Box
            component="nav"
            sx={{ display: { xs: "none", md: "flex" }, gap: 3, ml: 4 }}
          >
            {navLinks.map((item) => (
              <NavItem key={item.text} to={item.to}>
                {item.text}
              </NavItem>
            ))}
          </Box>

          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "block" } }} />
          <ThemeButton />
        </Toolbar>
      </AppBar>

      <nav>
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: "block", md: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: 240,
            },
          }}
        >
          {drawer}
        </Drawer>
      </nav>

      <Box component="main" sx={{ p: 3, maxWidth: "1380px", mx: "auto" }}>
        <Outlet />
      </Box>
    </>
  );
};

export default Layout;
