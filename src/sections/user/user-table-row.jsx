import { useBoolean } from 'src/hooks/use-boolean';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import { toast } from 'sonner';
import { AvatarGroup, Typography } from '@mui/material';

import { RouterLink } from 'src/routes/components';
import { oneClickLoginAdmin } from 'src/api/admins';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { CustomPopover, usePopover } from 'src/components/custom-popover';

import { UserQuickEditForm } from './user-quick-edit-form';
import { UserModal } from './UserModal';

// ----------------------------------------------------------------------

export function UserTableRow({ row, selected, editHandller, editHref, onSelectRow, onDeleteRow, setSelectedAdmin, editModal }) {
  const menuActions = usePopover();
  const confirmDialog = useBoolean();
  const quickEditForm = useBoolean();
  const userModal = useBoolean();

  const renderQuickEditForm = () => (
    <UserQuickEditForm
      currentUser={row}
      open={quickEditForm.value}
      onClose={quickEditForm.onFalse}
    />
  );

  const renderMenuActions = () => (
    <CustomPopover
      open={menuActions.open}
      anchorEl={menuActions.anchorEl}
      onClose={menuActions.onClose}
      slotProps={{ arrow: { placement: 'right-top' } }}
    >
      <MenuList>
        <li>
          <MenuItem
            component={RouterLink}
            href={editHref}
            onClick={userModal.onTrue}
            // onClick={() => menuActions.onClose()}
          >
            <Iconify icon="solar:pen-bold" />
            Edit
          </MenuItem>
        </li>

        <MenuItem
          onClick={() => {
            confirmDialog.onTrue();
            menuActions.onClose();
          }}
          sx={{ color: 'error.main' }}
        >
          <Iconify icon="solar:trash-bin-trash-bold" />
          Delete
        </MenuItem>
      </MenuList>
    </CustomPopover>
  );

  const renderConfirmDialog = () => (
    <ConfirmDialog
      open={confirmDialog.value}
      onClose={confirmDialog.onFalse}
      title="Delete"
      content="Are you sure want to delete?"
      action={
        <Button variant="contained" color="error" onClick={onDeleteRow}>
          Delete
        </Button>
      }
    />
  );

  const handleLoginAsAdmin = async (id) => {
    try {

      const data = await oneClickLoginAdmin(id);

      if (!data?.accessToken) {
        throw new Error('Access token not found');
      } 

      const adminDomain = import.meta.env.VITE_ADMIN_DOMAIN;

      const loginUrl = `${adminDomain}/auth/jwt/superadmin-login?token=${data.accessToken}`;

      // Opens in a new tab
      window.open(loginUrl, '_blank');

    } catch (error) {
      console.error(error);
      toast.error('Admin login failed');
    }
  };

  return (
    <>
      <TableRow hover selected={selected} aria-checked={selected} tabIndex={-1}>
        {/* <TableCell padding="checkbox">
          <Checkbox
            checked={selected}
            onClick={onSelectRow}
            slotProps={{
              input: {
                id: `${row.id}-checkbox`,
                'aria-label': `${row.id} checkbox`,
              },
            }}
          />
        </TableCell> */}

        <TableCell>
          <Box sx={{ gap: 2, display: 'flex', alignItems: 'center' }}>
            <Avatar alt={row.name} src={row.avatarUrl} />

            <Stack sx={{ typography: 'body2', flex: '1 1 auto', alignItems: 'flex-start' }}>
              <Link
                component={RouterLink}
                href={editHref}
                color="inherit"
                sx={{ cursor: 'pointer' }}
              >
                {row.name}
              </Link>
              <Box component="span" sx={{ color: 'text.disabled' }}>
                {row.email}
              </Box>
            </Stack>
          </Box>
        </TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.business}</TableCell>

        {/* <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.roles}</TableCell> */}

        <TableCell>
          {row.connectors?.length > 0 ? (
            <Stack direction="row" spacing={1} alignItems="center">
              <AvatarGroup
                max={4}
                sx={{ '& .MuiAvatar-root': { width: 24, height: 24, border: '2px solid white' } }}
              >
                {row.connectors.slice(0, 2).map((connector) => {
                  // connector might be an object or a plain string
                  const name =
                    typeof connector === 'string'
                      ? connector
                      : connector?.name ?? String(connector?.id ?? '');

                  // fallback initial(s)
                  const initials = name
                    ? name.split(' ').map(s => s[0]).join('').slice(0, 2).toUpperCase()
                    : '?';

                  // stable key: prefer connector.id if available, else use name
                  const key = typeof connector === 'object' && connector?.id ? connector.id : name;

                  return (
                    <Avatar key={key} alt={name} title={name}>
                      {initials}
                    </Avatar>
                  );
                })}
              </AvatarGroup>

              {row.connectors?.length > 2 && (
                <Typography color="text.secondary" variant="caption">
                  +{(row.connectors.length ?? 0) - 2} more
                </Typography>
              )}
            </Stack>
          ) : (
            <Typography variant="caption" color="text.secondary">
              No connectors assigned
            </Typography>
          )}
        </TableCell>

        <TableCell>
          <Label
            variant="soft"
            color={
              (row.status === 'ACTIVE' && 'success') ||
              (row.status === 'ARCHIVED' && 'error') ||
              'default'
            }
          >
            {row.status}
          </Label>
        </TableCell>

        <TableCell >
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', ml: -1.5 }}>
            <IconButton
              component={RouterLink}
              href={editHref}
              onClick={() => {
                setSelectedAdmin(row);
                editModal.onTrue();
              }}
            >
              <Iconify icon="solar:pen-bold" />
            </IconButton>
            <IconButton variant="outlined" size="small" onClick={() => handleLoginAsAdmin(row.id)}><Iconify icon="solar:login-3-bold" /></IconButton>
          </Box>
        </TableCell>
        {/* <TableCell>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton
              color={menuActions.open ? 'inherit' : 'default'}
              onClick={menuActions.onOpen}
            >
              <Iconify icon="eva:more-vertical-fill" />
            </IconButton>
          </Box>
        </TableCell> */}
      </TableRow>

      {renderQuickEditForm()}
      {renderMenuActions()}
      {renderConfirmDialog()}

      <UserModal currentUser={row} open={userModal.value} onClose={userModal.onFalse} />
    </>
  );
}
