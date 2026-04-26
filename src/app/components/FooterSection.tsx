import { useEffect, useState } from "react";
import svgPaths from "@/imports/Footer/svg-39tshfia8v";

// ─── Live Prague time ─────────────────────────────────────────────────────────
function usePragueTime() {
  const [time, setTime] = useState("");

  useEffect(() => {
    const update = () => {
      setTime(
        new Date().toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
          timeZone: "Europe/Prague",
        })
      );
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  return time;
}

// ─── Vibe logo (white) ────────────────────────────────────────────────────────
function VibeLogoWhite() {
  return (
    <svg width="51" height="24" viewBox="0 0 50.3951 24" fill="none">
      <path d={svgPaths.p2641c400} fill="white" />
      <path d={svgPaths.p11b87d00} fill="white" />
      <path d={svgPaths.p2bd5b200} fill="white" />
      <path d={svgPaths.pdd8c00}   fill="white" />
    </svg>
  );
}

// ─── Arrow (from Figma — arrow-top-left rotated 135° = top-right ↗) ──────────
function ArrowRight() {
  return (
    <div style={{ width: 50.912, height: 50.912, position: "relative", flexShrink: 0 }}>
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ transform: "rotate(135deg)" }}>
          {/* arrow-top-left 36×36 */}
          <div style={{ width: 36, height: 36, position: "relative", overflow: "clip" }}>
            <div style={{ position: "absolute", inset: "12.5%" }}>
              <div style={{ position: "absolute", inset: "-5.56%" }}>
                <svg width="100%" height="100%" viewBox="0 0 30 30" fill="none" preserveAspectRatio="none">
                  <path d="M1.5 1.5L28.5 28.5" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" />
                  <path d="M19.5 1.5H1.5V19.5" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Flower SVG (dotted map / flower shape from Figma) ────────────────────────
function FlowerSvg() {
  return (
    <svg
      viewBox="0 0 423 560"
      fill="none"
      className="w-full h-full"
      preserveAspectRatio="xMidYMid meet"
    >
      <path d={svgPaths.p14937800} fill="white" />
      <path d={svgPaths.p16f76eb0} fill="white" />
      <path d={svgPaths.p2badb300} fill="white" />
      <path d={svgPaths.p126d1580} fill="white" />
      <path d={svgPaths.p135dd00}  fill="white" />
      <path d={svgPaths.p5942400}  fill="white" />
      <path d={svgPaths.p10fee000} fill="white" />
      <path d={svgPaths.p28febeb0} fill="white" />
      <path d={svgPaths.p184af380} fill="white" />
      <path d={svgPaths.p24663000} fill="white" />
      <path d={svgPaths.p2b2ea4f0} fill="white" />
      <path d={svgPaths.p29a78780} fill="white" />
      <path d={svgPaths.p14b2dd00} fill="white" />
      <path d={svgPaths.p9e2ea80}  fill="white" />
      <path d={svgPaths.p163fd600} fill="white" />
      <path d={svgPaths.p246d4a80} fill="white" />
      <path d={svgPaths.paa7d700}  fill="white" />
      <path d={svgPaths.pa7ecaf0}  fill="white" />
      <path d={svgPaths.p23832380} fill="white" />
      <path d={svgPaths.p21156a80} fill="white" />
      <path d={svgPaths.pbd66980}  fill="white" />
      <path d={svgPaths.p33e73200} fill="white" />
      <path d={svgPaths.p2f4c7070} fill="white" />
      <path d={svgPaths.pdf70200}  fill="white" />
      <path d={svgPaths.p8904e00}  fill="white" />
      <path d={svgPaths.p28c62f0}  fill="white" />
      <path d={svgPaths.p27ed3b80} fill="white" />
      <path d={svgPaths.p1bca580}  fill="white" />
      <path d={svgPaths.p244a4ff0} fill="white" />
      <path d={svgPaths.p2cb35700} fill="white" />
      <path d={svgPaths.p5704100}  fill="white" />
      <path d={svgPaths.p2dea4f30} fill="white" />
      <path d={svgPaths.p18596a40} fill="white" />
      <path d={svgPaths.p319cfc00} fill="white" />
      <path d={svgPaths.p29ebad00} fill="white" />
      <path d={svgPaths.p2d8d5900} fill="white" />
      <path d={svgPaths.p2fe2bec0} fill="white" />
      <path d={svgPaths.p8cd9c40}  fill="white" />
      <path d={svgPaths.p26abc940} fill="white" />
      <path d={svgPaths.pf2e5700}  fill="white" />
      <path d={svgPaths.p13012b00} fill="white" />
      <path d={svgPaths.p46403c0}  fill="white" />
      <path d={svgPaths.p2f19040}  fill="white" />
      <path d={svgPaths.p3d843280} fill="white" />
      <path d={svgPaths.p24873ac0} fill="white" />
      <path d={svgPaths.p734f600}  fill="white" />
      <path d={svgPaths.p18ffd700} fill="white" />
      <path d={svgPaths.p13342100} fill="white" />
      <path d={svgPaths.p1e940900} fill="white" />
      <path d={svgPaths.p3d8fce80} fill="white" />
      <path d={svgPaths.p2e497980} fill="white" />
      <path d={svgPaths.p3aca9140} fill="white" />
      <path d={svgPaths.p3c2e6880} fill="white" />
      <path d={svgPaths.pb8a0000}  fill="white" />
      <path d={svgPaths.p3d985280} fill="white" />
      <path d={svgPaths.p2e265b70} fill="white" />
      <path d={svgPaths.p26ef3a40} fill="white" />
      <path d={svgPaths.p2c532280} fill="white" />
      <path d={svgPaths.p3566d530} fill="white" />
      <path d={svgPaths.p2b667680} fill="white" />
      <path d={svgPaths.p1a664640} fill="white" />
      <path d={svgPaths.p1f82080}  fill="white" />
      <path d={svgPaths.pa64dc80}  fill="white" />
      <path d={svgPaths.p2735db00} fill="white" />
      <path d={svgPaths.p3a7ddd00} fill="white" />
      <path d={svgPaths.p2bb03b00} fill="white" />
      <path d={svgPaths.p3f320800} fill="white" />
      <path d={svgPaths.p110c7400} fill="white" />
      <path d={svgPaths.p274fa370} fill="white" />
      <path d={svgPaths.p2cc2fa40} fill="white" />
      <path d={svgPaths.p39546700} fill="white" />
      <path d={svgPaths.p12148500} fill="white" />
      <path d={svgPaths.p384e280}  fill="white" />
      <path d={svgPaths.p2b34a100} fill="white" />
      <path d={svgPaths.p1770b400} fill="white" />
      <path d={svgPaths.p19d88e00} fill="white" />
      <path d={svgPaths.p3e8f5700} fill="white" />
      <path d={svgPaths.p1cbb7300} fill="white" />
      <path d={svgPaths.p1b8a78f0} fill="white" />
      <path d={svgPaths.p32bea4d0} fill="white" />
      <path d={svgPaths.p8da7dc0}  fill="white" />
      <path d={svgPaths.p16527e00} fill="white" />
      <path d={svgPaths.p2b28dd00} fill="white" />
      <path d={svgPaths.p327bae00} fill="white" />
      <path d={svgPaths.p10ff5280} fill="white" />
      <path d={svgPaths.p184e3e80} fill="white" />
      <path d={svgPaths.pbfbc400}  fill="white" />
      <path d={svgPaths.p3ba59200} fill="white" />
      <path d={svgPaths.p1054fc00} fill="white" />
      <path d={svgPaths.p348c0f40} fill="white" />
      <path d={svgPaths.p30e82180} fill="white" />
      <path d={svgPaths.pfaeff00}  fill="white" />
      <path d={svgPaths.p2a39bb00} fill="white" />
      <path d={svgPaths.p158757c0} fill="white" />
      <path d={svgPaths.p39c48400} fill="white" />
      <path d={svgPaths.p23d4db80} fill="white" />
      <path d={svgPaths.p14f15100} fill="white" />
      <path d={svgPaths.p31b26c00} fill="white" />
      <path d={svgPaths.p27ad900}  fill="white" />
      <path d={svgPaths.p12777200} fill="white" />
      <path d={svgPaths.p1209ac00} fill="white" />
      <path d={svgPaths.p7247080}  fill="white" />
      <path d={svgPaths.p360008c0} fill="white" />
      <path d={svgPaths.p1d5e8080} fill="white" />
      <path d={svgPaths.p711a300}  fill="white" />
      <path d={svgPaths.p10434d70} fill="white" />
      <path d={svgPaths.p3f0b3300} fill="white" />
      <path d={svgPaths.p10370200} fill="white" />
      <path d={svgPaths.p1af23830} fill="white" />
      <path d={svgPaths.p35c3da00} fill="white" />
      <path d={svgPaths.p201a8300} fill="white" />
      <path d={svgPaths.p2b4b7300} fill="white" />
      <path d={svgPaths.p32791080} fill="white" />
      <path d={svgPaths.p3decd400} fill="white" />
      <path d={svgPaths.p361a9ac0} fill="white" />
      <path d={svgPaths.p2de70c00} fill="white" />
      <path d={svgPaths.p1678d600} fill="white" />
      <path d={svgPaths.p6897980}  fill="white" />
      <path d={svgPaths.p143e2d80} fill="white" />
      <path d={svgPaths.p283338f2} fill="white" />
      <path d={svgPaths.pcf67a80}  fill="white" />
      <path d={svgPaths.p34bda600} fill="white" />
      <path d={svgPaths.pdfa7b00}  fill="white" />
      <path d={svgPaths.p27aad4f0} fill="white" />
      <path d={svgPaths.p2ddba180} fill="white" />
      <path d={svgPaths.pc954a00}  fill="white" />
      <path d={svgPaths.p2d72f300} fill="white" />
      <path d={svgPaths.p2711ed00} fill="white" />
      <path d={svgPaths.p17755200} fill="white" />
      <path d={svgPaths.p26d65340} fill="white" />
      <path d={svgPaths.p25f9700}  fill="white" />
      <path d={svgPaths.p1258be80} fill="white" />
      <path d={svgPaths.p9409900}  fill="white" />
      <path d={svgPaths.p1e7c4c80} fill="white" />
      <path d={svgPaths.p6800500}  fill="white" />
      <path d={svgPaths.p24c7bd00} fill="white" />
      <path d={svgPaths.p3fef9780} fill="white" />
      <path d={svgPaths.p3a979f80} fill="white" />
      <path d={svgPaths.p1315f00}  fill="white" />
      <path d={svgPaths.p38720672} fill="white" />
      <path d={svgPaths.pe61ef00}  fill="white" />
      <path d={svgPaths.p156b9900} fill="white" />
      <path d={svgPaths.pd38e880}  fill="white" />
      <path d={svgPaths.p34e4800}  fill="white" />
      <path d={svgPaths.p2ad3100}  fill="white" />
      <path d={svgPaths.p387f4a00} fill="white" />
      <path d={svgPaths.p3f002c80} fill="white" />
      <path d={svgPaths.p37355b00} fill="white" />
      <path d={svgPaths.p97478f2}  fill="white" />
      <path d={svgPaths.pff66100}  fill="white" />
      <path d={svgPaths.p3d921c80} fill="white" />
      <path d={svgPaths.p2e80a2f0} fill="white" />
      <path d={svgPaths.p9bb9180}  fill="white" />
      <path d={svgPaths.p1fa47600} fill="white" />
      <path d={svgPaths.pd52b080}  fill="white" />
      <path d={svgPaths.p83cbe00}  fill="white" />
      <path d={svgPaths.p31b17480} fill="white" />
      <path d={svgPaths.p1855e000} fill="white" />
      <path d={svgPaths.p1b89db00} fill="white" />
      <path d={svgPaths.p33934080} fill="white" />
      <path d={svgPaths.p3d5f9280} fill="white" />
      <path d={svgPaths.p3afd7e00} fill="white" />
      <path d={svgPaths.p3ec8ef00} fill="white" />
      <path d={svgPaths.pcd6cf00}  fill="white" />
      <path d={svgPaths.p28aa9f00} fill="white" />
      <path d={svgPaths.p1e2efd00} fill="white" />
      <path d={svgPaths.pf038300}  fill="white" />
      <path d={svgPaths.p3ae31b80} fill="white" />
      <path d={svgPaths.pdd3d900}  fill="white" />
      <path d={svgPaths.p1dfc5380} fill="white" />
      <path d={svgPaths.p2e06000}  fill="white" />
      <path d={svgPaths.p2375b980} fill="white" />
      <path d={svgPaths.p37dfa700} fill="white" />
      <path d={svgPaths.p10c4a700} fill="white" />
      <path d={svgPaths.p1205880}  fill="white" />
      <path d={svgPaths.pbca080}   fill="white" />
      <path d={svgPaths.p2db78c00} fill="white" />
      <path d={svgPaths.pf630800}  fill="white" />
      <path d={svgPaths.p390f5300} fill="white" />
      <path d={svgPaths.p22b3f00}  fill="white" />
      <path d={svgPaths.p2771a7f0} fill="white" />
      <path d={svgPaths.p3757e00}  fill="white" />
      <path d={svgPaths.p27c55800} fill="white" />
      <path d={svgPaths.p3f4c0d70} fill="white" />
      <path d={svgPaths.p1a1e900}  fill="white" />
      <path d={svgPaths.p10494700} fill="white" />
      <path d={svgPaths.p1cae6e80} fill="white" />
      <path d={svgPaths.p3ae27000} fill="white" />
      <path d={svgPaths.p259f71f0} fill="white" />
      <path d={svgPaths.p2e78e500} fill="white" />
      <path d={svgPaths.pccc64c0}  fill="white" />
      <path d={svgPaths.p36f93100} fill="white" />
      <path d={svgPaths.p2fd4ed00} fill="white" />
      <path d={svgPaths.p2f088380} fill="white" />
      <path d={svgPaths.p22071300} fill="white" />
      <path d={svgPaths.pe010600}  fill="white" />
      <path d={svgPaths.p15895a00} fill="white" />
      <path d={svgPaths.p10aad980} fill="white" />
      <path d={svgPaths.p39898d80} fill="white" />
      <path d={svgPaths.p2cfb4980} fill="white" />
      <path d={svgPaths.p32c61700} fill="white" />
      <path d={svgPaths.p21ca8300} fill="white" />
      <path d={svgPaths.pf401780}  fill="white" />
      <path d={svgPaths.p1a148d80} fill="white" />
      <path d={svgPaths.pb43c4b0}  fill="white" />
      <path d={svgPaths.p9db400}   fill="white" />
      <path d={svgPaths.p3177f180} fill="white" />
      <path d={svgPaths.p3fd6f270} fill="white" />
      <path d={svgPaths.p3a63680}  fill="white" />
      <path d={svgPaths.p30227c80} fill="white" />
      <path d={svgPaths.p26d70d80} fill="white" />
      <path d={svgPaths.p524fe80}  fill="white" />
      <path d={svgPaths.p29422100} fill="white" />
      <path d={svgPaths.p3cc8bb00} fill="white" />
      <path d={svgPaths.p300f5c80} fill="white" />
      <path d={svgPaths.p14fdb500} fill="white" />
      <path d={svgPaths.p355d0300} fill="white" />
      <path d={svgPaths.p18339780} fill="white" />
      <path d={svgPaths.p22c85a00} fill="white" />
      <path d={svgPaths.p38a15300} fill="white" />
      <path d={svgPaths.p1a59eb00} fill="white" />
      <path d={svgPaths.p11633300} fill="white" />
      <path d={svgPaths.p6ce5c00}  fill="white" />
      <path d={svgPaths.p1bf1f080} fill="white" />
      <path d={svgPaths.p15068500} fill="white" />
      <path d={svgPaths.p3c862a00} fill="white" />
      <path d={svgPaths.p176b2600} fill="white" />
      <path d={svgPaths.p348a6e00} fill="white" />
      <path d={svgPaths.p3ab5b3c0} fill="white" />
      <path d={svgPaths.pf241af0}  fill="white" />
      <path d={svgPaths.pc615880}  fill="white" />
      <path d={svgPaths.p6340100}  fill="white" />
      <path d={svgPaths.p2bd39d80} fill="white" />
      <path d={svgPaths.p265138c0} fill="white" />
      <path d={svgPaths.p199095f0} fill="white" />
      <path d={svgPaths.pe0e9240}  fill="white" />
      <path d={svgPaths.p13e287c0} fill="white" />
      <path d={svgPaths.p3f2fc080} fill="white" />
      <path d={svgPaths.p21ee9a00} fill="white" />
      <path d={svgPaths.p1928c200} fill="white" />
      <path d={svgPaths.pa21b00}   fill="white" />
      <path d={svgPaths.p1c1da780} fill="white" />
      <path d={svgPaths.p2b75480}  fill="white" />
      <path d={svgPaths.pa502800}  fill="white" />
      <path d={svgPaths.p2c4f2c00} fill="white" />
      <path d={svgPaths.p2403ae70} fill="white" />
      <path d={svgPaths.p390a4f00} fill="white" />
      <path d={svgPaths.p2681ef00} fill="white" />
      <path d={svgPaths.p6b52700}  fill="white" />
      <path d={svgPaths.p3e555680} fill="white" />
      <path d={svgPaths.pa2abe80}  fill="white" />
      <path d={svgPaths.p3b8aa600} fill="white" />
      <path d={svgPaths.p35d3b640} fill="white" />
      <path d={svgPaths.p72c7000}  fill="white" />
      <path d={svgPaths.p4bead00}  fill="white" />
      <path d={svgPaths.p2ed11a80} fill="white" />
      <path d={svgPaths.p1f6a6800} fill="white" />
      <path d={svgPaths.pf5352b0}  fill="white" />
      <path d={svgPaths.p34f84a80} fill="white" />
      <path d={svgPaths.p1e46e100} fill="white" />
      <path d={svgPaths.p1ca2de00} fill="white" />
      <path d={svgPaths.p29a3a000} fill="white" />
      <path d={svgPaths.p1cd8ccc0} fill="white" />
      <path d={svgPaths.p2b499900} fill="white" />
      <path d={svgPaths.p3a9fe0f0} fill="white" />
      <path d={svgPaths.p19fa4ef0} fill="white" />
      <path d={svgPaths.p5b51f80}  fill="white" />
      <path d={svgPaths.p1ac6c300} fill="white" />
      <path d={svgPaths.pb169f00}  fill="white" />
      <path d={svgPaths.p514a500}  fill="white" />
      <path d={svgPaths.p14690b40} fill="white" />
      <path d={svgPaths.p30ef4380} fill="white" />
      <path d={svgPaths.paf21b00}  fill="white" />
      <path d={svgPaths.p3042f980} fill="white" />
      <path d={svgPaths.p17c1fe00} fill="white" />
      <path d={svgPaths.p20f2e700} fill="white" />
      <path d={svgPaths.p3f518300} fill="white" />
      <path d={svgPaths.p11b2000}  fill="white" />
      <path d={svgPaths.p359279f0} fill="white" />
      <path d={svgPaths.p1ebf9e00} fill="white" />
      <path d={svgPaths.p1ee80f80} fill="white" />
      <path d={svgPaths.p35d84d70} fill="white" />
      <path d={svgPaths.p3c013000} fill="white" />
      <path d={svgPaths.p2ef79980} fill="white" />
      <path d={svgPaths.p1f2abe80} fill="white" />
      <path d={svgPaths.pc821500}  fill="white" />
      <path d={svgPaths.p3331e700} fill="white" />
      <path d={svgPaths.p8562a00}  fill="white" />
      <path d={svgPaths.p1520c000} fill="white" />
      <path d={svgPaths.p1c204a80} fill="white" />
      <path d={svgPaths.p3846a700} fill="white" />
      <path d={svgPaths.pb8d9af0}  fill="white" />
      <path d={svgPaths.pc890600}  fill="white" />
      <path d={svgPaths.p1c6f5880} fill="white" />
      <path d={svgPaths.p38979970} fill="white" />
      <path d={svgPaths.pde1ac00}  fill="white" />
      <path d={svgPaths.p1b4e5b00} fill="white" />
      <path d={svgPaths.pb8bfc00}  fill="white" />
      <path d={svgPaths.p2258800}  fill="white" />
      <path d={svgPaths.p3fbaf300} fill="white" />
      <path d={svgPaths.p33e8a620} fill="white" />
      <path d={svgPaths.p2b942a00} fill="white" />
      <path d={svgPaths.p3f35b370} fill="white" />
      <path d={svgPaths.p1006b980} fill="white" />
      <path d={svgPaths.p1008b980} fill="white" />
      <path d={svgPaths.p10611800} fill="white" />
      <path d={svgPaths.p1068dc00} fill="white" />
      <path d={svgPaths.p10aad980} fill="white" />
      <path d={svgPaths.p112659f0} fill="white" />
      <path d={svgPaths.p1136cfb0} fill="white" />
      <path d={svgPaths.p1184b100} fill="white" />
      <path d={svgPaths.p11877980} fill="white" />
      <path d={svgPaths.p118ce880} fill="white" />
      <path d={svgPaths.p11aa2400} fill="white" />
      <path d={svgPaths.p11ca2c00} fill="white" />
      <path d={svgPaths.p121a0f00} fill="white" />
      <path d={svgPaths.p1454d400} fill="white" />
      <path d={svgPaths.p14dd4600} fill="white" />
      <path d={svgPaths.p14e8df00} fill="white" />
      <path d={svgPaths.p150b7100} fill="white" />
      <path d={svgPaths.p11102c00} fill="white" />
    </svg>
  );
}

// ─── Footer Section ───────────────────────────────────────────────────────────
export function FooterSection() {
  const pragueTime = usePragueTime();

  return (
    <footer
      className="relative w-full overflow-hidden"
      style={{ backgroundColor: "#171010" }}
    >
      {/* Flower SVG — decorative, centered, partially clipped at bottom */}
      <div
        className="absolute pointer-events-none"
        style={{
          width: "clamp(280px, 35vw, 480px)",
          left: "50%",
          transform: "translateX(-20%)",
          top: "clamp(200px, 28vw, 400px)",
          opacity: 0.9,
        }}
      >
        <FlowerSvg />
      </div>

      {/* Main content */}
      <div
        className="relative z-10 mx-auto w-full flex flex-col"
        style={{
          maxWidth: 1920,
          paddingLeft:  "clamp(20px, 2.1vw, 40px)",
          paddingRight: "clamp(20px, 2.1vw, 40px)",
          paddingTop:   "clamp(64px, 6.8vw, 131px)",
          paddingBottom:"clamp(32px, 3vw, 56px)",
          minHeight: "clamp(500px, 60vw, 760px)",
        }}
      >
        {/* ── Headline ── */}
        <a
          href="mailto:vibestudio@design"
          className="flex items-center gap-4 group w-fit mb-auto"
          style={{ textDecoration: "none" }}
        >
          <h2
            style={{
              fontWeight: 500,
              fontSize: "clamp(32px, 4.5vw, 68px)",
              color: "white",
              letterSpacing: "-0.04em",
              lineHeight: "normal",
            }}
          >
            Let's grow together
          </h2>
          <span className="shrink-0 transition-transform duration-300 group-hover:translate-x-2">
            <ArrowRight />
          </span>
        </a>

        {/* ── Contact info block ── */}
        <div
          className="flex flex-col gap-8 mt-4"
          style={{ maxWidth: 320 }}
        >
          {/* Location + time */}
          <div className="flex flex-col gap-1">
            <p
              style={{
                fontWeight: 400,
                fontSize: "clamp(16px, 1.4vw, 24px)",
                color: "white",
                letterSpacing: "-0.03em",
                lineHeight: "normal",
              }}
            >
              Prague, CZ
            </p>
            <p
              style={{
                fontWeight: 400,
                fontSize: "clamp(15px, 1.25vw, 22px)",
                color: "rgba(255,255,255,0.4)",
                letterSpacing: "-0.03em",
                lineHeight: "normal",
              }}
            >
              {pragueTime}
            </p>
          </div>

          {/* Email + phone */}
          <div className="flex flex-col gap-1">
            <a
              href="mailto:vibestudio@design"
              style={{
                fontWeight: 400,
                fontSize: "clamp(16px, 1.4vw, 24px)",
                color: "white",
                letterSpacing: "-0.03em",
                lineHeight: "normal",
                textDecoration: "none",
              }}
              className="hover:opacity-60 transition-opacity duration-200"
            >
              vibestudio@design
            </a>
            <a
              href="tel:+421911014410"
              style={{
                fontWeight: 400,
                fontSize: "clamp(15px, 1.25vw, 22px)",
                color: "rgba(255,255,255,0.4)",
                letterSpacing: "-0.03em",
                lineHeight: "normal",
                textDecoration: "none",
              }}
              className="hover:opacity-60 transition-opacity duration-200"
            >
              +421 911 014 410
            </a>
          </div>
        </div>

        {/* ── Bottom bar ── */}
        <div className="flex items-center justify-between mt-16 pt-6">
          {/* Vibe logo */}
          <VibeLogoWhite />

          {/* Social links */}
          <nav className="flex items-center gap-6 sm:gap-8">
            {[
              { label: "Instagram", href: "#" },
              { label: "LinkedIn",  href: "#" },
              { label: "X",         href: "#" },
              { label: "Join Us",   href: "#" },
            ].map(({ label, href }) => (
              <a
                key={label}
                href={href}
                style={{
                  fontWeight: 400,
                  fontSize: "clamp(15px, 1.25vw, 22px)",
                  color: "white",
                  letterSpacing: "-0.03em",
                  textDecoration: "none",
                }}
                className="hover:opacity-50 transition-opacity duration-200 whitespace-nowrap"
              >
                {label}
              </a>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}