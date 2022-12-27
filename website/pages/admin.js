import NavBar from '../components/navbar'
import Link from "next/link";
import {useState} from 'react'

async function createTask(e) {
    e.preventDefault()
    const form = e.currentTarget;
    const url = form.action;

    const formData = new FormData(form);
    const plainFormData = Object.fromEntries(formData.entries());
    const formDataJsonString = JSON.stringify(plainFormData);

    const fetchOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
        },
        body: formDataJsonString,
    };

    const response = await fetch(url, fetchOptions);

    if (!response.ok) {
        const errorMessage = await response.text();
        console.log(errorMessage)
        return
    }

    const responseData = response.json();
    console.log({responseData})
}

async function deleteTask(task_code) {
    console.log(task_code)
    const fetchOptions = {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
        },
        body: JSON.stringify({task_code: task_code}),
    };

    const response = await fetch("http://localhost:8080/tasks/delete/" + task_code, fetchOptions);

    if (!response.ok) {
        const errorMessage = await response.text();
        console.log(errorMessage)
        return
    }

    const responseData = response.json();
    console.log({responseData})
}

export default function Admin(props) {

    const [tasks, setTasks] = useState(props.tasks)
    let admin_table_entries = []

    let refreshTable = async () => {
        const res = await fetch(`http://localhost:8080/tasks/list`)
        const tasks = await res.json()
        setTasks(tasks)

    }
    let createTaskAndRefreshTable = async (e) => {
        await createTask(e);
        await refreshTable();
    }
    let deleteTaskAndRefreshTable = async (task_code) => {
        await deleteTask(task_code);
        await refreshTable();
    }
    let displayTaskDeleteModal = async (task_name, task_code) => {
        document.getElementById("delete-task-modal-header").innerHTML=task_name
        document.getElementById("delete-task-modal-confirm").onclick= async ()=> {
            await deleteTaskAndRefreshTable(task_code);
            document.getElementById("delete-task-modal-close").click()
        }
        document.getElementById("delete-task-modal-show").click()

    }
    tasks.forEach((task) => {
        admin_table_entries.push(
            <tr key={task["task_code"]}>
                <th scope="row"><Link href={"/tasks/" + task["task_code"]}><a
                    className="nav-link">{task["task_code"]}</a></Link></th>
                <td><Link href={"/tasks/" + task["task_code"]}><a
                    className="nav-link">{task["task_name"]}</a></Link>
                </td>
                <td><span className="badge bg-primary">ProblemCon++</span></td>
                <td><span className="badge bg-danger">6.9</span></td>
                <td>2</td>
                <td>13</td>
                <td>
                    <button type="button" className="btn btn-sm btn-primary me-1">Rediģēt</button>
                    <button type="button" className="btn btn-sm btn-danger ms-1"
                            onClick={() => displayTaskDeleteModal(task["task_name"], task["task_code"])}>Izdzēst
                    </button>
                </td>
            </tr>
        )
    })

    return (
        <div>
            <NavBar active_page={"admin"}/>
            <main className="container">
                <h1 className="my-4 text-center">administrācija</h1>
                <form action="http://localhost:8080/tasks/create" onSubmit={createTaskAndRefreshTable}>
                    <div className="row">
                        <div className="mb-3 col">
                            <input type="text" className="form-control" id="task-code" name="task_code"
                                   placeholder={"kods"}/>
                        </div>
                        <div className="mb-3 col">
                            <input type="text" className="form-control" id="task-name" name="task_name"
                                   placeholder={"nosaukums"}/>
                        </div>
                        <div className={"col"}>
                            <button type="submit" className="btn btn-success">pievienot uzdevumu</button>
                        </div>
                    </div>
                </form>
                <table className="table table-hover" style={{tableLayout: "fixed"}}>
                    <thead>
                    <tr>
                        <th scope="col">kods</th>
                        <th scope="col">nosaukums</th>
                        <th scope="col">birkas</th>
                        <th scope="col">grūtība</th>
                        <th scope="col">atrisinājumi</th>
                        <th scope="col">iesūtījumi</th>
                        <th scope={"col"}>darbības</th>
                    </tr>
                    </thead>
                    <tbody>
                    {admin_table_entries}
                    </tbody>
                </table>
            </main>
            <button type="button" className="btn btn-primary d-none" id="delete-task-modal-show" data-bs-toggle="modal"
                    data-bs-target="#delete-task-modal">
            </button>
            <div className="modal fade" id="delete-task-modal" tabIndex="-1">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="delete-task-modal-header"></h5>
                            <button id="delete-task-modal-close" type="button" className="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div className="modal-body">
                            Vai esat pārliecināti, ka vēlaties dzēst šo uzdevumu?
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">aizvērt
                            </button>
                            <button type="button" className="btn btn-danger" id="delete-task-modal-confirm">dzēst uzdevumu</button>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
}


// This gets called on every request
export async function getServerSideProps() {
    // Fetch data from external API
    const res = await fetch(`http://localhost:8080/tasks/list`)
    const tasks = await res.json()
    // Pass data to the page via props
    return {props: {tasks}}
}
