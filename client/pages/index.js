import Sidebar from '../components/sidebar'
import CodeMirror from '@uiw/react-codemirror';
import { sublime } from '@uiw/codemirror-theme-sublime'
import { javascript } from '@codemirror/lang-javascript'
import { cpp } from '@codemirror/lang-cpp'

const hello_cpp = `#include <bits/stdc++.h>

using namespace std;

int main() {
  cout<<"Hello, world!"<<endl;
}
`
export default function Home() {
  return (
    <div className="container-fluid">
      <div className="row flex-nowrap">
        <div className="col-auto col-md-3 col-xl-2 px-sm-2 px-0 bg-dark">
          <Sidebar />
        </div>
        <div className="col-auto col-md-9 col-xl-10 px-sm-10 px-0">
          <CodeMirror
            className="h-100"
            value={hello_cpp}
            theme={sublime}
            height='100%'
            extensions={[cpp()]}
            onChange={(value, viewUpdate) => {
              console.log('value:', value);
            }}
          />
        </div>
      </div>
    </div>
  )
}