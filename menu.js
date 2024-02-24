const getStoredSolves = () => {
  const storedSolves = localStorage.getItem("solves");
  // const solves = !!storedSolves ? storedSolves.split(",").filter(s=>s.includes(":")) : [];
  const solves = {};
  if (!!storedSolves) {
    for (let lvlSc of storedSolves.split(",")) {
      if (!lvlSc.includes(":")) continue;
      const [lvl,scoreStr] = lvlSc.split(":");
      const score = parseInt(scoreStr);
      if (isNaN(score) || score <= 0) continue;
      solves[parseInt(lvl)] = score;
    }
  }
  return solves;
}

const menuStrs = {}

const menuBorder = ("X".repeat(19)+"\n").repeat(2);
const menuTop = menuBorder+
`XXXXXstuckobanXXXXX
XXXXXXXXXXXXXXXXXXX
XXX             XXX
XXX       X     XXX
XXX       XX    XXX
`;
const menuBottom =
`XXX       XX    XXX
XXX       X     XXX
XXX             XXX
XXapuzzlegamebyXXXX
XXXXtheobjectrackXX
`+menuBorder;
const menuBlank = "XXX"+" ".repeat(13)+"XXX"+"\n";
menuStrs.titleStart =
"\n"+menuTop+
"XXX P XXXXXXX      \n"+
menuBottom;
// const menuBorder = ("X".repeat(19)+"\n").repeat(2);
// const menuTop = menuBorder+
// `XXXXXstuckobanXXXXX
// `;
// const menuBottom = menuBorder;
// const menuBlank = "XX"+" ".repeat(15)+"XX"+"\n";
// menuStrs.titleStart =
// "\n"+menuTop+menuBlank.repeat(4)+
// "XX P               \n"+
// menuBlank.repeat(4)+("X".repeat(19)+"\n")+menuBottom;
menuStrs.titleFromRight =
"\n"+menuTop+
"XXX   XXXXXXX     P\n"+
menuBottom;

const levelTop =
`
XXX XXX XXX XXX XXX
XOX XOX XOX XOX XOX
`+`X2XXX3XXX4XXX5XXX6X
`.repeat(11)+
`X XXX XXX XXX XXX X
X                 X
X                 X
X  XXX  XXX  XXX  X
`
const levelBottom =
`
X  XXX  XXX  XXX  X
X                 X
X                 X
X XXX XXX XXX XXX X
`+`X7XXX8XXX9XXXAXXXBX
`.repeat(11)+
`XOX XOX XOX XOX XOX
XXX XXX XXX XXX XXX
`// remove A above when have >10 levels
menuStrs.levelsFromLeft   = levelTop+"P  1OX  1OX  1OX   "+levelBottom;
menuStrs.levelsFromRight  = levelTop+"   1OX  1OX  1OX  P"+levelBottom;
menuStrs.levelsFromBottom = levelTop+"   1OX  1OX  1OX P "+levelBottom;

const level2Top =
`
XXX XXX XXX XXX XXX
XOX XOX XOX XOX XOX
`+"XBXXXCXXXDXXXEXXX X\n".repeat(20)+
`X XXX XXX XXX XXX X
X                 X
X                 X
X  XXXXXXXXXXXXX  X
`
const level2Bottom =
`
X  XXXXXXXXXXXXX  X
X                 X
X                 X
X XXX XXX XXX XXX X
`+"XFXXXGXXXHXXXIXXXJX\n".repeat(20)+
`XOX XOX XOX XOX XOX
XXX XXX XXX XXX XXX
`
// menuStrs.levels2FromLeft   = level2Top+"P  XOAAAAAAAAAA    "+level2Bottom;
// menuStrs.levels2FromRight  = level2Top+"   XOAAAAAAAAAA   P"+level2Bottom;
menuStrs.levels2FromTop = level2Top+"X  XOAAAAAAAAAA  PX"+level2Bottom;

const statTop = "X".repeat(19)+"\n";
const statBlank = "XX"+" ".repeat(16)+"X"+"\n";
const statRow = "XX                X\n"
const numStatBottomRows = Math.max(3,Math.ceil((levelStrs.length-10)/3)+Object.keys(getStoredSolves()).filter(i=>parseInt(i)<0).length)
menuStrs.statsScreen =
"\n"+" ".repeat(19)+statTop+(" ".repeat(19)+statBlank+" ".repeat(19)+statRow).repeat(3)+
"XX        9        P                 X\n"+
(" ".repeat(19)+statRow+" ".repeat(19)+statBlank).repeat(numStatBottomRows)+" ".repeat(19)+statTop;

const secretBlank = "XXXX"+" ".repeat(17)+"XXXX"+"\n";
menuStrs.secretRoom = "\n"+"XXXX"+statTop+
"XXXXXXXbonuslevelsXXXXXXX\n"+
secretBlank.repeat(0)+
`  O???               XX
  XX                 XX
  XX                 XX
  XX                 XX
  XXXXXXXXXXXX XXXXXXXX
  XXO                P
  XXXXXXXXXXXX XXXXXXXX
  XX                 XX
  XX                 XX
  XX                 XX
  XX                 XX
  XX       1491625364964O
`+
secretBlank.repeat(0)+"XXXX"+statTop;
