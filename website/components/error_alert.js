export default function ErrorAlert({ msg }) {
    if (msg) return (
        <div className="alert alert-danger text-center" role="alert">
            {msg}
        </div>)
    else return <></>
}