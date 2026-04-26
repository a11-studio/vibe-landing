function Group() {
  return (
    <div className="absolute inset-[12.5%]" data-name="Group">
      <div className="absolute inset-[-5.56%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 30 30">
          <g id="Group">
            <path d="M1.5 1.5L28.5 28.5" id="Vector" stroke="var(--stroke-0, #80999C)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" />
            <path d="M19.5 1.5H1.5V19.5" id="Vector_2" stroke="var(--stroke-0, #80999C)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function ArrowTopLeft() {
  return (
    <div className="overflow-clip relative size-[36px]" data-name="arrow-top-left 2">
      <Group />
    </div>
  );
}

function ArrowContainer() {
  return (
    <div className="absolute left-[691px] size-[50.912px] top-[433px]" data-name="Arrow container">
      <div className="absolute flex items-center justify-center left-0 size-[50.912px] top-0" style={{ "--transform-inner-width": "300", "--transform-inner-height": "19" } as React.CSSProperties}>
        <div className="flex-none rotate-135">
          <ArrowTopLeft />
        </div>
      </div>
    </div>
  );
}

function Lines() {
  return (
    <div className="absolute h-[616px] left-[660px] top-[385px] w-[1220px]" data-name="Lines">
      <div className="absolute inset-[-0.16%_0_0_0]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1220 617">
          <g id="Lines">
            <line id="Line 11" stroke="var(--stroke-0, white)" strokeOpacity="0.1" x2="1219" y1="0.5" y2="0.5" />
            <line id="Line 12" stroke="var(--stroke-0, white)" strokeOpacity="0.1" x1="1" x2="1220" y1="154.5" y2="154.5" />
            <line id="Line 13" stroke="var(--stroke-0, white)" strokeOpacity="0.1" x2="1219" y1="308.5" y2="308.5" />
            <line id="Line 14" stroke="var(--stroke-0, white)" strokeOpacity="0.1" x2="1219" y1="462.5" y2="462.5" />
            <line id="Line 15" stroke="var(--stroke-0, white)" strokeOpacity="0.1" x2="1219" y1="616.5" y2="616.5" />
          </g>
        </svg>
      </div>
    </div>
  );
}

export default function Container() {
  return (
    <div className="relative size-full" data-name="Container">
      <div className="absolute bg-[#013439] h-[1288px] left-0 top-0 w-[1926px]" data-name="Background" />
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[normal] left-[calc(50%-889px)] not-italic text-[68px] text-white top-[167px] tracking-[-3px] whitespace-nowrap">{`From idea to real `}</p>
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[normal] left-[calc(50%-889px)] not-italic text-[68px] text-white top-[241px] tracking-[-3px] whitespace-nowrap">product decisions.</p>
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[normal] left-[calc(50%-148px)] not-italic text-[48px] text-white top-[433px] tracking-[-3px] whitespace-nowrap">Validate product ideas</p>
      <ArrowContainer />
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[normal] left-[calc(50%-303px)] not-italic text-[48px] text-white top-[587px] tracking-[-3px] whitespace-nowrap">02</p>
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[normal] left-[calc(50%-305px)] not-italic text-[48px] text-white top-[741px] tracking-[-3px] whitespace-nowrap">03</p>
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[normal] left-[calc(50%-302px)] not-italic text-[48px] text-white top-[900px] tracking-[-3px] whitespace-nowrap">04</p>
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[normal] left-[calc(50%-148px)] not-italic text-[48px] text-white top-[587px] tracking-[-3px] whitespace-nowrap">Improve core product flows</p>
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[normal] left-[calc(50%-148px)] not-italic text-[48px] text-white top-[741px] tracking-[-3px] whitespace-nowrap">Build new product experiences</p>
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[normal] left-[calc(50%-148px)] not-italic text-[48px] text-white top-[895px] tracking-[-3px] whitespace-nowrap">Support product teams</p>
      <Lines />
    </div>
  );
}