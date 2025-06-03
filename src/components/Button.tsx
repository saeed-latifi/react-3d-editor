interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export default function Button(props: ButtonProps) {
    return <button {...props} className="flex items-center justify-center text-white rounded-lg border border-white p-3 bg-blue-950" />;
}
