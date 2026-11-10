import Enterprise from "../client/src/pages/Enterprise";
import EnterpriseContact from "../client/src/pages/EnterpriseContact";
export function EnterpriseRouter({ pathname }: { pathname: string }) {
  return /^\/contact\/?$/.test(pathname) ? (
    <EnterpriseContact />
  ) : (
    <Enterprise />
  );
}
