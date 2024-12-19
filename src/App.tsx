import CaptchaComponent from "./components/CaptchaComponent"

function App() {

  return (
    <>
     <div className="text-center text-4xl">
      <h1>React AWS WAF Captcha Example</h1>
      <p>Click the button below to show the captcha</p>
      <CaptchaComponent/>
     </div>
    </>
  )
}

export default App
