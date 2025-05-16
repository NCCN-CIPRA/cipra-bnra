import usePageTitle from "../../hooks/usePageTitle";
import useBreadcrumbs from "../../hooks/useBreadcrumbs";
import { BottomNavigation, BottomNavigationAction, Paper } from "@mui/material";
import ContactsIcon from "@mui/icons-material/Contacts";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import BarChartIcon from "@mui/icons-material/BarChart";
import EmailIcon from "@mui/icons-material/Email";
import { useLocation, useNavigate, useOutletContext } from "react-router-dom";
import UserListTab from "./UserListTab";
import { AdminPageContext } from "../AdminPage";
import EmailManagementTab from "./EmailManagementTab";

/**
 * REGISTRATION FLOW:
 *
 * 1. User fills in form (https://forms.office.com/Pages/ResponsePage.aspx?id=oiwZ3nj3sEu18VzOWAN4mrJ-1wb6PPBIm-NfScMSabRUM005OE9QT0dLRFM3UFVOU1JBTENPQkNMOS4u)
 *
 * 2. Power Automate creates a contact with the information from the form (owned by user Joep Driesen)
 *
 * 3. CIPRA analist approves the user in the user management page of the BNRA Application
 *
 * 4. Power Automate is triggered => an invitation is created (if it doesn't exist yet) and an invitation email (according to the template) is sent to the contact
 *
 * 5. When the contact clicks the link in the invitation email, they can finish their registration
 *
 */

export default function UserManagementPage() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { user } = useOutletContext<AdminPageContext>();

  usePageTitle("User Management");
  useBreadcrumbs([
    { name: "BNRA", url: "/" },
    { name: "User Management", url: "/admin/users" },
  ]);

  let tab = 0;
  if (pathname.indexOf("bulk") >= 0) tab = 1;
  if (pathname.indexOf("emails") >= 0) tab = 2;
  if (pathname.indexOf("statistics") >= 0) tab = 3;

  return (
    <>
      {tab === 0 && <UserListTab user={user} />}
      {tab === 1 && <UserListTab user={user} />}
      {tab === 2 && <EmailManagementTab />}
      {tab === 3 && <UserListTab user={user} />}
      <Paper
        sx={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 1201,
        }}
        elevation={3}
      >
        <BottomNavigation showLabels value={tab}>
          <BottomNavigationAction
            label="Users"
            icon={<ContactsIcon />}
            onClick={() => navigate(`/admin/users`)}
          />
          <BottomNavigationAction
            label="Bulk Create"
            icon={<GroupAddIcon />}
            onClick={() => navigate(`/admin/users/bulk`)}
          />
          <BottomNavigationAction
            label="Email Templates"
            icon={<EmailIcon />}
            onClick={() => navigate(`/admin/users/emails`)}
          />
          <BottomNavigationAction
            label="Statistics"
            icon={<BarChartIcon />}
            onClick={() => navigate(`/admin/users/statistics`)}
          />
        </BottomNavigation>
      </Paper>
    </>
  );
}
