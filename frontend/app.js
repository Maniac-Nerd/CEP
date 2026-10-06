const API_BASE = (localStorage.getItem("everlocker_api") || "https://cep-16gz.onrender.com/api").replace(/\/$/, "");

const quiz = [
  {q:"What is DigiLocker mainly used for?", o:["Digital document access and sharing","Online gaming","Food delivery","Music streaming"], a:0},
  {q:"Which section contains documents issued by integrated organisations?", o:["Issued Documents","Recycle Bin","Games","Settings"], a:0},
  {q:"What should you never post in an educational help form?", o:["A general question","A dummy example","An OTP or password","A service category"], a:2},
  {q:"Which organisation operates the Aadhaar system?", o:["UIDAI","DigiLocker College Club","RBI Games","ISRO Library"], a:0},
  {q:"What is the safest place to perform an actual government service?", o:["A random link","The official government portal","A social-media comment","An unknown APK"], a:1}
];

let qi=0, score=0, selected=null;
const $=id=>document.getElementById(id);

function renderQuiz(){
  const item=quiz[qi];
  $("quizQuestion").innerHTML=`<h3>Question ${qi+1} of ${quiz.length}</h3><p>${item.q}</p>`;
  $("quizOptions").innerHTML=item.o.map((x,i)=>`<button class="quiz-option ${selected===i?"selected":""}" data-i="${i}">${String.fromCharCode(65+i)}. ${x}</button>`).join("");
  document.querySelectorAll(".quiz-option").forEach(b=>b.onclick=()=>{selected=Number(b.dataset.i);renderQuiz();});
  $("nextQuestion").textContent=qi===quiz.length-1?"Finish Quiz":"Next Question";
}
$("nextQuestion").onclick=()=>{
  if(selected===null){$("quizResult").textContent="Choose an answer first.";return;}
  if(selected===quiz[qi].a) score++;
  if(qi<quiz.length-1){qi++;selected=null;renderQuiz();$("quizResult").textContent="";}
  else {$("quizQuestion").innerHTML=`<h3>Quiz complete 🎉</h3><p>You scored ${score}/${quiz.length}.</p>`;$("quizOptions").innerHTML="";$("nextQuestion").style.display="none";$("quizResult").textContent=score>=4?"Great work!":"Good attempt — review the FAQ and try again."; }
};
renderQuiz();

let authMode="login";

function updateAuthButton(){
  const user=JSON.parse(localStorage.getItem("everlocker_user")||"null");
  const button=$("loginBtn");
  if(user){
    button.textContent=`Log out (${user.name})`;
    button.setAttribute("aria-label",`Log out ${user.name}`);
  }else{
    button.textContent="Login / Sign up";
    button.setAttribute("aria-label","Login or sign up");
  }
}

function setAuthMode(mode){
  authMode=mode;
  const signingUp=mode==="signup";
  $("authEyebrow").textContent=signingUp?"CREATE ACCOUNT":"MEMBER LOGIN";
  $("authTitle").textContent=signingUp?"Join EverLocker":"Welcome back";
  $("registerNameWrap").hidden=!signingUp;
  $("registerName").required=signingUp;
  $("loginPassword").autocomplete=signingUp?"new-password":"current-password";
  $("authSubmit").textContent=signingUp?"Create account":"Login";
  $("authSwitch").innerHTML=signingUp
    ?'Already have an account? <button id="showLogin" type="button">Login</button>'
    :'New to EverLocker? <button id="showSignup" type="button">Create an account</button>';
  $(signingUp?"showLogin":"showSignup").onclick=()=>{
    setAuthMode(signingUp?"login":"signup");
    $("loginMessage").textContent="";
  };
}

updateAuthButton();
$("loginBtn").onclick=()=>{
  if(localStorage.getItem("everlocker_token")){
    localStorage.removeItem("everlocker_token");
    localStorage.removeItem("everlocker_user");
    updateAuthButton();
    $("loginMessage").textContent="You have been logged out.";
    $("loginModal").classList.remove("hidden");
    setAuthMode("login");
    return;
  }
  $("loginMessage").textContent="";
  setAuthMode("login");
  $("loginModal").classList.remove("hidden");
};
$("closeLogin").onclick=()=>$("loginModal").classList.add("hidden");
$("loginModal").onclick=e=>{
  if(e.target===$("loginModal")) $("loginModal").classList.add("hidden");
};

$("loginForm").onsubmit=async e=>{
  e.preventDefault();
  const msg=$("loginMessage");
  const signingUp=authMode==="signup";
  const submit=$("authSubmit");
  submit.disabled=true;
  submit.textContent=signingUp?"Creating account...":"Logging in...";
  msg.textContent="";
  try{
    const payload={email:$("loginEmail").value.trim(),password:$("loginPassword").value};
    if(signingUp) payload.name=$("registerName").value.trim();
    const r=await fetch(API_BASE+`/auth/${signingUp?"register":"login"}`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(payload)});
    const data=await r.json();
    if(!r.ok) throw new Error(data.message||(signingUp?"Registration failed":"Login failed"));
    if(signingUp){
      $("loginForm").reset();
      setAuthMode("login");
      msg.textContent="Account created. Log in with your new account.";
      return;
    }
    localStorage.setItem("everlocker_token",data.token);
    localStorage.setItem("everlocker_user",JSON.stringify(data.user));
    updateAuthButton();
    msg.textContent=`Welcome, ${data.user.name}!`;
    if(data.user.role==="admin") setTimeout(()=>location.href="admin.html",400);
    else setTimeout(()=>$("loginModal").classList.add("hidden"),900);
  }catch(err){msg.textContent=err.message+" (Is the backend running?)";}
  finally{
    submit.disabled=false;
    submit.textContent=authMode==="signup"?"Create account":"Login";
  }
};

$("queryForm").onsubmit=async e=>{
  e.preventDefault();
  const msg=$("queryMessage"); msg.textContent="Sending...";
  try{
    const r=await fetch(API_BASE+"/queries",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({
      name:$("queryName").value,email:$("queryEmail").value,category:$("queryCategory").value,question:$("queryText").value
    })});
    const data=await r.json();
    if(!r.ok) throw new Error(data.message||"Could not send query");
    msg.textContent="Query submitted successfully. The author can now see it in the database.";
    $("queryForm").reset();
  }catch(err){msg.textContent=err.message+" The backend and MongoDB Atlas must be running to save queries.";}
};
