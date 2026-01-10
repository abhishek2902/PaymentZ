import { useEffect } from 'react';

function PaymentIframePopup({ iframeHtml }) {
  useEffect(() => {
    if (iframeHtml) {
      const popup = window.open('', 'PaymentIframePopup', 'width=800,height=600');

      if (popup) {
        popup.document.write(iframeHtml);
        popup.document.close();
      } else {
        alert('Popup blocked. Please allow popups for this site.');
      }
    }
  }, [iframeHtml]);

  return null; // nothing rendered in main window
}

export default PaymentIframePopup;
