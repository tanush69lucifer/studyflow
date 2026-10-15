// Reusable controlled input: value React state se aati hai aur onChange state update karta hai.
export default function Field({ label, id, type = "text", value, onChange, placeholder, autoComplete }) {
  return <label className="field" htmlFor={id}>
    <span>{label}</span>
    <input id={id} name={id} type={type} value={value} onChange={onChange}
      placeholder={placeholder} autoComplete={autoComplete} />
  </label>;
}
