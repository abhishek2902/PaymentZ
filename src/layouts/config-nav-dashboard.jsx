import { paths } from 'src/routes/paths';

import { CONFIG } from 'src/config-global';

import { SvgColor } from 'src/components/svg-color';
import { Children } from 'react';

// ----------------------------------------------------------------------

const icon = (name) => <SvgColor src={`${CONFIG.assetsDir}/assets/icons/navbar/${name}.svg`} />;

const ICONS = {
  job: icon('ic-job'),
  blog: icon('ic-blog'),
  chat: icon('ic-chat'),
  mail: icon('ic-mail'),
  user: icon('ic-user'),
  file: icon('ic-file'),
  lock: icon('ic-lock'),
  tour: icon('ic-tour'),
  order: icon('ic-order'),
  label: icon('ic-label'),
  blank: icon('ic-blank'),
  kanban: icon('ic-kanban'),
  folder: icon('ic-folder'),
  course: icon('ic-course'),
  banking: icon('ic-banking'),
  booking: icon('ic-booking'),
  invoice: icon('ic-invoice'),
  product: icon('ic-product'),
  calendar: icon('ic-calendar'),
  disabled: icon('ic-disabled'),
  external: icon('ic-external'),
  menuItem: icon('ic-menu-item'),
  ecommerce: icon('ic-ecommerce'),
  analytics: icon('ic-analytics'),
  dashboard: icon('ic-dashboard'),
  parameter: icon('ic-parameter'),
  customer: icon('customer'),
};

// ----------------------------------------------------------------------

export const navData = [
  /**
   * Overview
   */
  {
    items: [
      // { title: 'Dashboard (System Overview)', path: paths.dashboard.root, icon: ICONS.dashboard },
      { title: 'Dashboard', path: paths.dashboard.root, icon: ICONS.dashboard },
    ],
  },
  {
    items: [
      { title: 'Transaction & Analytics', path: paths.dashboard.transactions, icon: ICONS.invoice },
    ],
  },
  {
    subheader: 'Users & Partners',
    items: [
      {
        title: 'Admins',
        path: paths.dashboard.users,
        icon: ICONS.user,
      },
      {
        title: 'Brokers',
        path: paths.dashboard.customers,
        icon: ICONS.customer,
      },
      {
        title: 'Admin Onboarding',
        path: paths.dashboard.adminOnboarding,
        icon: ICONS.user,
      },
    ],
  },
  {
    subheader: 'Banks & Providers',
    items: [
      // {
      //   title: 'Directory',
      //   path: paths.dashboard.paymentGateway,
      //   icon: ICONS.banking,
      // },
      {
        title: 'Connectors',
        path: paths.dashboard.connector,
        icon: ICONS.banking,
      },
    ],
  },
  // {
  //   subheader: 'Operations',
  //   items: [
  //     {
  //       title: 'Risk & Compliance',
  //       path: paths.dashboard.reporting,
  //       icon: ICONS.analytics,
  //     },
  //   ],
  // },
  {
    items: [{ title: 'Settings', path: paths.dashboard.sites, icon: ICONS.kanban }],
  },
  // {
  //   items: [
  //     { title: 'Dashboard', path: paths.dashboard.root, icon: ICONS.dashboard },
  //     { title: 'Payment Gateway', path: paths.dashboard.paymentGateway, icon: ICONS.banking },
  //     { title: 'Businesses', path: paths.dashboard.merchants, icon: ICONS.user },
  //     { title: 'Sites', path: paths.dashboard.sites, icon: ICONS.menuItem },
  //     { title: 'Transactions', path: paths.dashboard.transactions, icon: ICONS.invoice },
  //     { title: 'Users', path: paths.dashboard.users, icon: ICONS.user },
  //     { title: 'Reporting', path: paths.dashboard.reporting, icon: ICONS.analytics },
  //     // { title: 'Customers', path: paths.dashboard.customers, icon: ICONS.customer },
  //     // { title: 'Virtual Terminal', path: paths.dashboard.newtransaction, icon: ICONS.blank },
  //   ],
  // },
];
