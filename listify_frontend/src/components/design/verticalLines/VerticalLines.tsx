import React from 'react'
import './VerticalLines.css'

type Props = {
    className?: string
}

const VerticalLines: React.FC<Props> = ({ className = '' }) => {
    const lines = [
        { color: '#1E1E1E' },
        { color: '#3387B9' },
        { color: '#24B81F' },
    ]

    return (
        <div className={`vertical-lines ${className}`.trim()} aria-hidden="true">
            <div className="vertical-lines__inner">
                {lines.map((line, index) => (
                    <svg
                        key={line.color}
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="972"
                        viewBox="0 0 20 972"
                        fill="none"
                        focusable="false"
                        className="vertical-lines__line"
                        style={{ left: `${index * 35}px` }}
                    >
                        <path d="M10 0V972" stroke={line.color} strokeWidth="20" strokeLinecap="butt" />
                    </svg>
                ))}
            </div>
        </div>
    )
}
export default VerticalLines
