export function UIBuilderLogo({ size = 32 }: { size?: number }) {
  return (
    <div className="flex items-center justify-center" style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Background gradient circle */}
        <defs>
          <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3B82F6" />
            <stop offset="100%" stopColor="#1D4ED8" />
          </linearGradient>
          <linearGradient id="componentGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F59E0B" />
            <stop offset="100%" stopColor="#D97706" />
          </linearGradient>
        </defs>
        
        {/* Main circle background */}
        <circle cx="16" cy="16" r="15" fill="url(#logoGradient)" stroke="#1E40AF" strokeWidth="1"/>
        
        {/* Grid lines representing canvas */}
        <g opacity="0.3">
          <line x1="8" y1="6" x2="8" y2="26" stroke="white" strokeWidth="0.5"/>
          <line x1="16" y1="6" x2="16" y2="26" stroke="white" strokeWidth="0.5"/>
          <line x1="24" y1="6" x2="24" y2="26" stroke="white" strokeWidth="0.5"/>
          <line x1="6" y1="8" x2="26" y2="8" stroke="white" strokeWidth="0.5"/>
          <line x1="6" y1="16" x2="26" y2="16" stroke="white" strokeWidth="0.5"/>
          <line x1="6" y1="24" x2="26" y2="24" stroke="white" strokeWidth="0.5"/>
        </g>
        
        {/* Component blocks */}
        <rect x="7" y="9" width="6" height="3" rx="1" fill="url(#componentGradient)" opacity="0.9"/>
        <rect x="19" y="9" width="6" height="3" rx="1" fill="white" opacity="0.8"/>
        <rect x="7" y="20" width="6" height="3" rx="1" fill="white" opacity="0.8"/>
        <rect x="19" y="20" width="6" height="3" rx="1" fill="url(#componentGradient)" opacity="0.9"/>
        
        {/* Center building block icon */}
        <rect x="13" y="13" width="6" height="6" rx="1" fill="white" opacity="0.95"/>
        <rect x="14" y="14" width="1.5" height="1.5" rx="0.2" fill="#3B82F6"/>
        <rect x="16.5" y="14" width="1.5" height="1.5" rx="0.2" fill="#F59E0B"/>
        <rect x="14" y="16.5" width="1.5" height="1.5" rx="0.2" fill="#10B981"/>
        <rect x="16.5" y="16.5" width="1.5" height="1.5" rx="0.2" fill="#EF4444"/>
      </svg>
    </div>
  );
}

export function UIBuilderLogoWithText({ logoSize = 32 }: { logoSize?: number }) {
  return (
    <div className="flex items-center space-x-3">
      <UIBuilderLogo size={logoSize} />
      <div className="flex flex-col">
        <h1 className="text-lg font-bold text-gray-900 leading-tight">UI Builder</h1>
        <p className="text-xs text-gray-500 leading-tight">Visual Component Creator</p>
      </div>
    </div>
  );
}