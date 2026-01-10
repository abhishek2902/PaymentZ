import { Helmet } from 'react-helmet-async';
import FormTransaction from 'src/sections/newtransaction/FormTransaction';

export default function NewTransaction() {
  return (
    <>
      <Helmet>
        <title>Virtual Terminal</title>
      </Helmet>
      <FormTransaction />
    </>
  );
}
