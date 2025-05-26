import React, { useState } from 'react';

export function Tabs({ children, defaultValue, className = "" }) {
  const [value, setValue] = useState(defaultValue);
  const list = children.find(child => child.type.name === 'TabsList');
  const contents = children.filter(child => child.type.name === 'TabsContent');
  return (
    <div className={className}>
      {list && React.cloneElement(list, { value, setValue })}
      {contents.map((content) => (
        value === content.props.value ? content : null
      ))}
    </div>
  );
}

export function TabsList({ children, value, setValue }) {
  return <div className="flex border-b mb-2">{React.Children.map(children, child => React.cloneElement(child, { isActive: child.props.value === value, onClick: () => setValue(child.props.value) }))}</div>;
}

export function TabsTrigger({ children, value, isActive, onClick }) {
  return (
    <button onClick={onClick} className={`px-4 py-2 text-sm ${isActive ? 'border-b-2 border-blue-500 font-bold' : 'text-gray-500'}`}>
      {children}
    </button>
  );
}

export function TabsContent({ children }) {
  return <div>{children}</div>;
}