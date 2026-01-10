// src/api/application.js
import axios, { endpoints } from 'src/utils/axios';
import { apiRequest } from "src/utils/apiClientutil";

const baseURL= import.meta.env.VITE_API_BASE_URL;

export function submitOnboardForm1(data) {
  return apiRequest(`${baseURL}${endpoints.onboarding.submitOnboardingForm1}`, "POST", data);
}

export function onboadingFormMdr(id) {
  return apiRequest(`${baseURL}${endpoints.onboarding.onboadingFormMdr(id)}`);
}

export function submitOnboardForm2(id,data) {
  return apiRequest(`${baseURL}${endpoints.onboarding.submitOnboardingForm2(id)}`, "POST", data);
}

export const approveApplication = async (data) => {
  const res = await axios.post(endpoints.onboarding.approve,data);
  return res.data;
}

export const approveApplication2 = async (params) => {
  const res = await axios.post(endpoints.onboarding.approve2,null,{params});
  return res.data;
}

export const rejectApplication = async (data) => {
  const res = await axios.post(endpoints.onboarding.reject,data);
  return res.data;
}

export const getApplications = async () => {
  const res = await axios.get(endpoints.onboarding.list);
  return res.data;
}

export const onboadinglist = async (filters) => {
  const res = await axios.get(endpoints.onboarding.list, {
    params: {
      page: filters?.page ?? 0,
      size: filters?.size ?? 10,
      status: filters?.status || null,
      search: filters?.search || '',
      startDate: filters?.startDate || '',
      endDate: filters?.endDate || '',
    },
  });
  return res.data;
};


export const onboardingDashboardNew = async () => {
  const res = await axios.get(endpoints.onboardingDashboard.new); 
  return res.data.data.totalElements;
};

export const onboardingDashboardKycInProgress = async () => {
  const res = await axios.get(endpoints.onboardingDashboard.kycInProgress); 
  return res.data.data.totalElements;
};

export const onboardingDashboardApprovalPending = async () => {
  const res = await axios.get(endpoints.onboardingDashboard.approvalPending); 
  return res.data.data.totalElements;
};

export const onboardingDashboardApprovedToday = async () => {
  const res = await axios.get(endpoints.onboardingDashboard.approvedToday); 
  return res.data.data.totalElements;
};
export const onboardingDashboardApprovedrejected = async () => {
  const res = await axios.get(endpoints.onboardingDashboard.rejected); 
  return res.data.data.totalElements;
};








// // Step 1
// export const submitOnboardForm1 = async (body, idx) => {
//   const urlWithId = `${endpoints.onboarding.submitOnboardingForm1}/${idx}`;
//   const res = await axios.post(urlWithId, body);
//   return res.data;
// };

// // step 2
// export const onboadinglist = async (id) => {
//   // remove later
//   axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL;
//   const urlWithId = `${endpoints.onboarding.list}/${id}`;
  
//   const res = await axios.get(urlWithId); 
//   return res.data;
// };

// // step 3
// export const approveApplication = async (body) => {
//   const res = await axios.post(endpoints.onboarding.approve, body);
//   return res.data;
// };

// // step 3 end
// export const rejectApplication = async (params) => {
//   const params2 = new URLSearchParams(params).toString();
//   const finalUrl = `${endpoints.onboarding.reject}?${params2}`;
//   const res = await axios.post(finalUrl);
//   return res.data;
// };

// // step 4
// export const onboadingFormMdr = async (id) => {    
//   const res = await axios.get(endpoints.onboarding.onboardingFormMdr(id)); 
//   return res.data;
// };

// // Step 5
// export const submitOnboardForm2 = async (body, idx) => {
//   const res = await axios.post(endpoints.onboarding.submitOnboardingForm2(idx), body);
//   return res.data;
// };

// // Step 5 may use like this API
// // export const submitOnboardForm22 = async (formData, idx) => {
// //   const url = `/onboarding/second-stage/${idx}`;
// //   const res = await apiClient.post(url, formData, {
// //     headers: { 'Content-Type': 'multipart/form-data' },
// //   });
// //   return res.data;
// // };

// // step 6
// export const approveApplication2 = async (params) => {
//   const params2 = new URLSearchParams(params).toString();
//   const finalUrl = `${endpoints.onboarding.approve2}?${params2}`;
//   const res = await axios.post(finalUrl);
//   // const res = await axios.post(endpoints.onboarding.approve2,  params ); not working in this style
//   return res.data;
// };
