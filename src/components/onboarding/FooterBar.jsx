import React from 'react';
import { Icon } from '@iconify/react';

import { alpha } from '@mui/material/styles';
import { Box, Link, Stack, Divider, Container, Typography } from '@mui/material';

function LogoMark({ logo, size = 28 }) {
  // If you pass a React node or an image URL, render it
  if (React.isValidElement(logo)) return logo;
  if (typeof logo === 'string')
    return (
      <Box
        component="img"
        src={logo}
        alt="logo"
        sx={{ width: size + 8, height: size + 8, objectFit: 'contain', borderRadius: 1 }}
      />
    );

  // Default gradient square with shield icon (like screenshot)
  return (
    <Box
      sx={{
        width: size + 16,
        height: size + 16,
        borderRadius: 1.5,
        display: 'grid',
        placeItems: 'center',
        color: 'common.white',
        background: (t) =>
          `linear-gradient(135deg, ${t.palette.primary.main}, ${t.palette.secondary.main})`,
        boxShadow: (t) => `0 8px 18px ${alpha(t.palette.primary.main, 0.35)}`,
        flexShrink: 0,
      }}
    >
      <Icon icon="mdi:shield-outline" width={size} height={size} />
    </Box>
  );
}

/**
 * FooterBar
 * Minimal responsive footer with brand (left) and links (right)
 */
export default function FooterBar({
  brand = 'Quiklie Payments',
  year = new Date().getFullYear(),
  logo, // ReactNode or image URL (optional)
  links = [
    { label: 'Privacy Policy', href: '#' },
    { label: 'Terms of Service', href: '#' },
    { label: 'Support', href: '#' },
  ],
  containerProps,
  sx,
}) {
  return (
    <Box component="footer" sx={{ pt: 1.5, ...sx }}>
      <Divider />

      <Container maxWidth="lg" {...containerProps}>
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          alignItems={{ xs: 'flex-start', md: 'center' }}
          justifyContent="space-between"
          spacing={{ xs: 1.5, md: 2 }}
          sx={{ py: 2.5 }}
        >
          {/* Left: brand */}
          <Stack direction="row" alignItems="center" spacing={1.25}>
            <LogoMark logo={logo} />
            <Box>
              <Typography variant="subtitle1" fontWeight={800} lineHeight={1.1}>
                {brand}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                © {year} All rights reserved
              </Typography>
            </Box>
          </Stack>

          {/* Right: links */}
          <Stack direction="row" spacing={{ xs: 2, md: 3 }}>
            {links.map((l) => (
              <Link key={l.label} href={l.href} underline="hover" color="text.primary">
                {l.label}
              </Link>
            ))}
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}
