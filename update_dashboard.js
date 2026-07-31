const fs = require('fs');
const path = 'frontend/src/pages/DashboardInvestor.tsx';

// Read tmp_dashboard.txt which has the original source.
// Since it might be utf16le, we read it with utf16le encoding.
let buf = fs.readFileSync('tmp_dashboard.txt');

// Let's check the first two bytes for BOM
let content = "";
if (buf[0] === 0xFF && buf[1] === 0xFE) {
  content = buf.toString('utf16le');
} else {
  content = buf.toString('utf8');
}

// Ensure no BOM at the start of string
if (content.charCodeAt(0) === 0xFEFF) {
  content = content.slice(1);
}

// 1. Add imports
content = content.replace(
  'import { CountUp } from "../components/landing/ui/CountUp";\r\nimport { User, MapPin, Heart, Calendar } from "lucide-react";',
  'import { CountUp } from "../components/landing/ui/CountUp";\r\nimport { User, MapPin, Heart, Calendar } from "lucide-react";\r\nimport { motion, AnimatePresence } from "framer-motion";\r\nimport { DashboardSkeleton } from "../components/skeletons/DashboardSkeleton";\r\nimport { ScoreRing } from "../components/ui/ScoreRing";'
);
content = content.replace( // Try unix newlines if the above failed
  'import { CountUp } from "../components/landing/ui/CountUp";\nimport { User, MapPin, Heart, Calendar } from "lucide-react";',
  'import { CountUp } from "../components/landing/ui/CountUp";\nimport { User, MapPin, Heart, Calendar } from "lucide-react";\nimport { motion, AnimatePresence } from "framer-motion";\nimport { DashboardSkeleton } from "../components/skeletons/DashboardSkeleton";\nimport { ScoreRing } from "../components/ui/ScoreRing";'
);

// 2. Remove old loading UI
content = content.replace(/  if \(loading \|\| dataLoading\) \{\s+return \(\s+<div className="flex flex-1 items-center justify-center bg-transparent min-h-screen">\s+<div className="h-8 w-8 animate-spin rounded-full border-4 border-\[#FE9638\] border-t-transparent"><\/div>\s+<\/div>\s+\);\s+\}/, "");


// 3. Wrap main return
content = content.replace(
  '  return (\r\n    <div className="flex flex-1 flex-col bg-transparent p-6 sm:p-10 text-[#FAFAFA] min-h-screen relative">',
  `  return (
    <AnimatePresence mode="wait">
      {loading || dataLoading ? (
        <motion.div
          key="skeleton"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          className="w-full flex flex-1 flex-col"
        >
          <DashboardSkeleton />
        </motion.div>
      ) : (
        <motion.div
          key="content"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          className="w-full flex flex-1 flex-col"
        >
          <div className="flex flex-1 flex-col bg-transparent p-6 sm:p-10 text-[#FAFAFA] min-h-screen relative">`
);
content = content.replace(
  '  return (\n    <div className="flex flex-1 flex-col bg-transparent p-6 sm:p-10 text-[#FAFAFA] min-h-screen relative">',
  `  return (
    <AnimatePresence mode="wait">
      {loading || dataLoading ? (
        <motion.div
          key="skeleton"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          className="w-full flex flex-1 flex-col"
        >
          <DashboardSkeleton />
        </motion.div>
      ) : (
        <motion.div
          key="content"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          className="w-full flex flex-1 flex-col"
        >
          <div className="flex flex-1 flex-col bg-transparent p-6 sm:p-10 text-[#FAFAFA] min-h-screen relative">`
);

// 4. Close wrapper
content = content.replace(
  '      )}\r\n    </div>\r\n  );\r\n};',
  `      )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};`
);
content = content.replace(
  '      )}\n    </div>\n  );\n};',
  `      )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};`
);

// 5. Replace Overall Score
content = content.replace(
  /<div>\s*<span className="block text-\[10px\] font-bold uppercase text-\[#666\]">Overall Score<\/span>\s*<span className="text-2xl font-black text-\[#FE9638\]">\s*<CountUp end=\{startup\.ai_score\?\.overall \|\| 0\} duration=\{2500\} separator="" className="" \/>\s*<span className="text-sm text-\[#666\]">\/100<\/span>\s*<\/span>\s*<\/div>/,
  `<div>
                      <ScoreRing score={startup.ai_score?.overall || 0} max={100} size={72} strokeWidth={8} />
                    </div>`
);


// Write it cleanly as UTF-8
fs.writeFileSync(path, content, 'utf8');
console.log("Successfully fixed and updated DashboardInvestor.tsx");
