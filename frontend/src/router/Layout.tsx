import {
  AppBar as MuiAppBar,
  type AppBarProps as MuiAppBarProps,
  Box,
  CssBaseline,
  Divider,
  Drawer as MuiDrawer,
  type DrawerProps as MuiDrawerProps,
  IconButton,
  List,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
  styled,
  Button,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import PeopleIcon from "@mui/icons-material/People";
import MenuIcon from "@mui/icons-material/Menu";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
// import { useAppDispatch } from "../utils/hooks";
// import { performLogout } from "../data/features/auth/authSlice";
import { useEffect, useState } from "react";
import { type Theme } from "@mui/material/styles";
import { type CSSObject } from "@emotion/react";
import { type SvgIconComponent } from "@mui/icons-material";
import EventNoteIcon from "@mui/icons-material/EventNote";

const drawerWidth = 200;

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

interface DrawerProps extends MuiDrawerProps {
  open?: boolean;
}

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar)<AppBarProps>(({ theme }) => ({
  position: "fixed",
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
}));

const PermanentDrawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})<DrawerProps>(({ theme, open }) => ({
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open
    ? {
        ...openedMixin(theme),
        "& .MuiDrawer-paper": openedMixin(theme),
      }
    : {
        ...closedMixin(theme),
        "& .MuiDrawer-paper": closedMixin(theme),
      }),
}));

const NavItem = ({
  label,
  to,
  icon: Icon,
  open,
  onNavigate,
}: {
  label: string;
  to: string;
  icon: SvgIconComponent;
  open: boolean;
  isMdUp: boolean;
  onNavigate: () => void;
}) => (
  <NavLink
    to={to}
    onClick={onNavigate}
    className={({ isActive }) =>
      `${
        isActive ? "bg-primary-light/[12%]" : "bg-transparent"
      } hover:bg-primary-light/[12%] transition-colors duration-300 rounded-md block`
    }
  >
    <ListItem disablePadding sx={{ display: "block" }}>
      <ListItemButton
        sx={{
          minHeight: 48,
          justifyContent: open ? "initial" : "center",
          px: 2.5,
        }}
      >
        <ListItemIcon
          sx={{
            minWidth: 0,
            mr: open ? 3 : "auto",
            justifyContent: "center",
            color: "text.primary",
          }}
        >
          <Icon />
        </ListItemIcon>
        <ListItemText
          primary={
            <Typography
              variant="subtitle1"
              sx={{ fontWeight: 700, color: "text.primary" }}
            >
              {label}
            </Typography>
          }
          sx={{ opacity: open ? 1 : 0 }}
        />
      </ListItemButton>
    </ListItem>
  </NavLink>
);

const Layout = () => {
  const theme = useTheme();
  //   const dispatch = useAppDispatch();
  const isMdUp = useMediaQuery(theme.breakpoints.up("md"));
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setOpen(isMdUp);
  }, [isMdUp]);

  const toggleDrawer = () => setOpen(!open);

  const navItems = [
    { label: "Schedule", icon: CalendarMonthIcon, path: "/" },
    { label: "Patients", icon: PendingActionsIcon, path: "/patients" },
    { label: "Doctors", icon: PeopleIcon, path: "/doctors" },
    { label: "Appointments", icon: EventNoteIcon, path: "/appointments" },
  ];

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        open={open}
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backgroundColor: "#fff",
          boxShadow: "none",
          borderBottom: "1px solid #E0D6CE",
          flexDirection: "row",
        }}
      >
        <Box
          sx={{
            width: drawerWidth,
            display: "flex",
            alignItems: "center",
            px: 2,
            borderRight: "1px solid #E0D6CE",
          }}
        >
          <IconButton
            color="inherit"
            onClick={() => {
              setOpen((prev) => !prev);
            }}
            edge="start"
            sx={{ color: "primary.main" }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            sx={{ fontWeight: 700, color: "primary.main", textWrap: "nowrap" }}
          >
            B Clinic
          </Typography>
        </Box>

        <Toolbar
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "row-reverse",
            justifyContent: "space-between",
            px: 2,
          }}
        >
          <Box display="flex" alignItems="center" gap={2}>
            <Button
              variant="contained"
              color="primary"
              //   onClick={() => dispatch(performLogout())}
            >
              LogOut
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      {isMdUp ? (
        <PermanentDrawer variant="permanent" open={open}>
          <DrawerHeader>
            <IconButton onClick={toggleDrawer}>
              {theme.direction === "rtl" ? (
                <ChevronRightIcon />
              ) : (
                <ChevronLeftIcon />
              )}
            </IconButton>
          </DrawerHeader>
          <Divider />
          <List>
            {navItems.map((item) => (
              <NavItem
                key={item.label}
                label={item.label}
                to={item.path}
                icon={item.icon}
                open={open}
                isMdUp={isMdUp}
                onNavigate={() => navigate(item.path)}
              />
            ))}
          </List>
        </PermanentDrawer>
      ) : (
        <MuiDrawer
          variant="temporary"
          open={open}
          onClose={() => setOpen(false)}
          ModalProps={{ keepMounted: true }}
        >
          <DrawerHeader>
            <IconButton onClick={() => setOpen(false)}>
              {theme.direction === "rtl" ? (
                <ChevronRightIcon />
              ) : (
                <ChevronLeftIcon />
              )}
            </IconButton>
          </DrawerHeader>
          <Divider />
          <List>
            {navItems.map((item) => (
              <NavItem
                key={item.label}
                label={item.label}
                to={item.path}
                icon={item.icon}
                open={true}
                isMdUp={isMdUp}
                onNavigate={() => setOpen(false)}
              />
            ))}
          </List>
        </MuiDrawer>
      )}

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          transition: theme.transitions.create("margin", {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
        }}
      >
        <DrawerHeader />
        <Outlet />
      </Box>
    </Box>
  );
};

export default Layout;
