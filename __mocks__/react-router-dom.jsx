export function Link({ to, children, ...props }) {
  return (
    <mock-link to={to} props={JSON.stringify(props)}>
      {children}
    </mock-link>
  );
}

export function NavLink({ to, children, ...props }) {
  return (
    <mock-nav-link to={to} props={JSON.stringify(props)}>
      {children}
    </mock-nav-link>
  );
}
export function Outlet() {
  return <mock-outlet />;
}

export function useNavigate() {
  return () => {};
}
