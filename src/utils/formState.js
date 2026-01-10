// Small helpers + initial state shared by all sections

export const getAt = (obj, path, fallback = '') =>
  path.split('.').reduce((o, k) => (o && o[k] !== undefined ? o[k] : undefined), obj) ?? fallback;

export const setAt = (obj, path, value) => {
  const keys = path.split('.');
  const last = keys.pop();
  // eslint-disable-next-line no-return-assign
  const base = keys.reduce((o, k) => (o[k] ??= {}), obj);
  base[last] = value;
  return obj;
};

export const phase1Initial = {
  personal: { fullName: '', email: '', phone: '', position: '', linkedin: '' },
  company: {
    companyName: '',
    registrationNo: '',
    industry: '',
    industryOther: '',
    website: '',
    companySize: '',
    yearsInBusiness: '',
    address: '',
    description: '',
  },
  processing: {
    annualVolume: '',
    avgTxn: '',
    banksCount: '',
    plan: '',
    banksDetails: '',
  },
};
