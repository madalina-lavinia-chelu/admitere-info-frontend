import MotionWrapper from "@/components/ui/motion-wrapper";
import { MockQuestionFlow } from "./mock-question-flow";

export function QuestionSection() {
  return (
    <section
      id="question"
      className="relative bg-blue-50/50 dark:bg-blue-950/20 px-4 py-16 md:pb-24 md:pt-24 overflow-hidden">
      {/* Subtle wave pattern */}
      <div className="absolute top-0 left-0 right-0 overflow-hidden">
        <svg
          className="w-full h-16 text-blue-200/30 dark:text-blue-800/30"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none">
          <path
            d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"
            opacity="0.6"
            fill="currentColor"></path>
          <path
            d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z"
            opacity="0.4"
            fill="currentColor"></path>
          <path
            d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z"
            opacity="0.8"
            fill="currentColor"></path>
        </svg>
      </div>

      {/* Floating code snippets */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Code snippet 1 */}
        <div className="absolute top-20 left-10 opacity-20 dark:opacity-10 text-blue-600 dark:text-blue-400 font-mono text-xs animate-float-slow">
          <div className="bg-white/50 dark:bg-gray-800/30 rounded-lg p-2 backdrop-blur-sm">
            if (answer === correct) &#123;<br/>
            &nbsp;&nbsp;score++;<br/>
            &#125;
          </div>
        </div>
        
        {/* Code snippet 2 */}
        <div className="absolute top-32 right-16 opacity-20 dark:opacity-10 text-blue-600 dark:text-blue-400 font-mono text-xs animate-float-medium">
          <div className="bg-white/50 dark:bg-gray-800/30 rounded-lg p-2 backdrop-blur-sm">
            function solve() &#123;<br/>
            &nbsp;&nbsp;return O(n log n);<br/>
            &#125;
          </div>
        </div>

        {/* Code snippet 3 */}
        <div className="absolute bottom-32 left-20 opacity-20 dark:opacity-10 text-blue-600 dark:text-blue-400 font-mono text-xs animate-float-fast">
          <div className="bg-white/50 dark:bg-gray-800/30 rounded-lg p-2 backdrop-blur-sm">
            while (learning) &#123;<br/>
            &nbsp;&nbsp;improve();<br/>
            &#125;
          </div>
        </div>

        {/* Mathematical symbols */}
        <div className="absolute top-40 right-32 opacity-15 dark:opacity-8 text-blue-500 text-2xl animate-pulse-slow">
          ∑ ∞ ∫ π
        </div>
        
        <div className="absolute bottom-40 right-10 opacity-15 dark:opacity-8 text-blue-500 text-lg animate-pulse-medium">
          { } [ ] ( )
        </div>
      </div>

      {/* Geometric patterns */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Hexagonal grid pattern */}
        <div className="absolute top-10 right-1/4 opacity-10 dark:opacity-5">
          <svg width="100" height="100" viewBox="0 0 100 100" className="text-blue-400">
            <defs>
              <pattern id="hexagon" x="0" y="0" width="20" height="17.32" patternUnits="userSpaceOnUse">
                <polygon points="10,1 18.66,6 18.66,15 10,20 1.34,15 1.34,6" 
                         fill="none" stroke="currentColor" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100" height="100" fill="url(#hexagon)"/>
          </svg>
        </div>

        {/* Circuit board lines */}
        <div className="absolute bottom-20 left-1/3 opacity-10 dark:opacity-5">
          <svg width="150" height="80" viewBox="0 0 150 80" className="text-blue-400">
            <path d="M10 40 L40 40 L50 30 L80 30 L90 40 L120 40" stroke="currentColor" strokeWidth="1" fill="none"/>
            <path d="M10 20 L30 20 L40 10 L70 10 L80 20 L140 20" stroke="currentColor" strokeWidth="1" fill="none"/>
            <circle cx="40" cy="40" r="2" fill="currentColor"/>
            <circle cx="90" cy="40" r="2" fill="currentColor"/>
            <circle cx="40" cy="10" r="2" fill="currentColor"/>
          </svg>
        </div>

        {/* Binary numbers */}
        <div className="absolute top-60 left-1/4 opacity-10 dark:opacity-5 text-blue-500 font-mono text-xs animate-slide-right">
          1010 1100 0110 1001
        </div>
        
        <div className="absolute bottom-60 right-1/3 opacity-10 dark:opacity-5 text-blue-500 font-mono text-xs animate-slide-left">
          0011 1010 1100 0101
        </div>
      </div>

      <div className="relative max-w-6xl mx-auto">
        <MotionWrapper type="spring-up" duration={0.8} delay={0.3}>
          <MockQuestionFlow />{" "}
        </MotionWrapper>
      </div>
    </section>
  );
}
