import React from 'react';
import { Icon } from '@iconify/react';

import { alpha } from '@mui/material/styles';
import { Box, Card, Grid, Link, Stack, Typography, CardContent } from '@mui/material';

/**
 * SupportHelpCard
 * Dark help panel with three contact options (phone, email, live chat).
 */
export default function SupportHelpCard({
  title = 'Need Help with Your Application?',
  subtitle = `Our onboarding specialists are here to assist you throughout the process. Get in touch if you have any questions or need guidance.`,
  // Phone
  phoneIcon = 'mdi:phone',
  phoneLabel = 'Phone Support',
  phoneNumber = '+1 (888) 555-0123',
  phoneHref, // defaults to tel:phoneNumber
  // Email
  emailIcon = 'mdi:email-outline',
  emailLabel = 'Email Support',
  email = 'onboarding@Quiklie Payments.com',
  emailHref, // defaults to mailto:email
  // Chat
  chatIcon = 'mdi:chat-processing',
  chatLabel = 'Live Chat',
  chatStatus = 'Available 24/7',
  chatHref = '#', // link to your chat widget/page
  sx,
}) {
  const items = [
    {
      key: 'phone',
      icon: phoneIcon,
      fg: '#ffffff',
      bg: (t) => alpha(t.palette.primary.main, 0.25),
      solid: (t) => t.palette.primary.main,
      heading: phoneLabel,
      sub: phoneNumber,
      href: phoneHref || `tel:${phoneNumber.replace(/[^+\\d]/g, '')}`,
    },
    {
      key: 'email',
      icon: emailIcon,
      fg: '#ffffff',
      bg: (t) => alpha(t.palette.success.main, 0.22),
      solid: (t) => t.palette.success.main,
      heading: emailLabel,
      sub: email,
      href: emailHref || `mailto:${email}`,
    },
    {
      key: 'chat',
      icon: chatIcon,
      fg: '#ffffff',
      bg: (t) => alpha(t.palette.secondary.main, 0.28),
      solid: (t) => t.palette.secondary.main,
      heading: chatLabel,
      sub: chatStatus,
      href: chatHref,
    },
  ];

  return (
    <Card
      variant="outlined"
      sx={{
        borderRadius: 3,
        color: 'common.white',
        borderColor: 'transparent',
        background: (t) =>
          `linear-gradient(180deg, ${alpha(t.palette.common.black, 0.2)} 0%, ${alpha(
            t.palette.common.black,
            0.2
          )} 100%), ${t.palette.mode === 'dark' ? t.palette.grey[900] : '#141a24'}`,
        ...sx,
      }}
    >
      <CardContent sx={{ p: { xs: 3, md: 4 } }}>
        <Stack spacing={1} alignItems="center" textAlign="center" sx={{ mb: 3 }}>
          <Typography variant="h5" fontWeight={800}>
            {title}
          </Typography>
          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.75)', maxWidth: 800 }}>
            {subtitle}
          </Typography>
        </Stack>

        <Grid container spacing={3} justifyContent="center">
          {items.map((it) => (
            <Grid key={it.key} item xs={12} sm={4}>
              <Stack spacing={1.25} alignItems="center" textAlign="center">
                <Box
                  sx={{
                    width: 56,
                    height: 56,
                    borderRadius: 2,
                    display: 'grid',
                    placeItems: 'center',
                    bgcolor: it.bg,
                    color: it.solid,
                  }}
                >
                  <Icon icon={it.icon} width={28} height={28} />
                </Box>

                <Typography variant="subtitle1" fontWeight={800}>
                  {it.heading}
                </Typography>

                {it.key === 'email' ? (
                  <Link href={it.href} underline="hover" color="inherit" sx={{ opacity: 0.85 }}>
                    {it.sub}
                  </Link>
                ) : (
                  <Link href={it.href} underline="none" color="inherit" sx={{ opacity: 0.85 }}>
                    {it.sub}
                  </Link>
                )}
              </Stack>
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  );
}
