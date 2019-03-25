let header = document.querySelector('#intro');
let anim = [
    { t: "{ }", ms: 200 },
    { t: "{_}", ms: 200 },
    { t: "{ }", ms: 200 },
    { t: "{_}", ms: 200 },
    { t: "{O_}", ms: 100 },
    { t: "{OT_}", ms: 100 },
    { t: "{OTT_}", ms: 100 },
    { t: "{OTTO_}", ms: 100 },
    { t: "{OTTOM_}", ms: 100 },
    { t: "{OTTOMA_}", ms: 100 },
    { t: "{OTTOMAT_}", ms: 100 },
    { t: "{OTTOMATE_}", ms: 100 },
    { t: "{OTTOMATED_}", ms: 100 },
    { t: "{OTTOMATED }", ms: 200 },
    { t: "{OTTOMATED_}", ms: 200 },
    { t: "{OTTOMATED }", ms: 200 },
    { t: "{OTTOMATED_}", ms: 200 },
    { t: "{OTTOMATED}", ms: 200 },
    { t: "{OTTOMATED}", ms: 200 }
];
let stepDenominator = 1;
if (window.localStorage.stepDenominator)
    stepDenominator = window.localStorage.stepDenominator;
let i = 0;
let update = () => {
    let step = anim[i];
    header.innerText = step.t;
    i++;

    if (i < anim.length)
        setTimeout(update, step.ms / stepDenominator);
    else {
        header.classList.add('top');
        setTimeout(() => {
            document.getElementById('main').style.opacity = 1;
            initGlobe();
        }, 500);
        window.localStorage.stepDenominator = 2;
    }
}
update();