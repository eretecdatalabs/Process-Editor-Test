import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from '@/components/ui/tabs'
import { 
  Plus, 
  Settings, 
  FileText, 
  Trash2, 
  ChevronDown, 
  ChevronRight, 
  BarChart3, 
  Search,
  SlidersHorizontal,
  ChevronUp,
  Menu,
  X
} from 'lucide-react'

export default function ProcessEditor() {
  const [activeMenu, setActiveMenu] = useState('manage')
  const [lines, setLines] = useState([{ name: 'Line 1', children: [], parameters: [], metadata: [], collapsed: false }])
  const [selectedLineIndex, setSelectedLineIndex] = useState(0)
  const [expandedParams, setExpandedParams] = useState({})
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed)
  }

  const toggleParamExpand = (path, paramIdx) => {
    const key = `${path.join('-')}-${paramIdx}`
    setExpandedParams(prev => ({
      ...prev,
      [key]: !prev[key]
    }))
  }

  const isParamExpanded = (path, paramIdx) => {
    const key = `${path.join('-')}-${paramIdx}`
    return !!expandedParams[key]
  }

  const toggleCollapse = (path) => {
    const newLines = [...lines]
    const traverse = (node, path, depth) => {
      if (depth === path.length) {
        node.collapsed = !node.collapsed
      } else {
        traverse(node.children[path[depth]], path, depth + 1)
      }
    }
    traverse(newLines[selectedLineIndex], path, 0)
    setLines(newLines)
  }

  const updateLineName = (e) => {
    const newLines = [...lines]
    newLines[selectedLineIndex].name = e.target.value
    setLines(newLines)
  }

  const addNode = (parentPath) => {
    const newLines = [...lines]
    const newNode = { name: 'New Node', children: [], parameters: [], metadata: [], collapsed: false }
    const traverse = (node, path, depth) => {
      if (depth === path.length - 1) {
        node.children[path[depth]].children.push(newNode)
      } else {
        traverse(node.children[path[depth]], path, depth + 1)
      }
    }
    if (parentPath.length === 0) {
      newLines[selectedLineIndex].children.push(newNode)
    } else {
      traverse(newLines[selectedLineIndex], parentPath, 0)
    }
    setLines(newLines)
  }

  const deleteNode = (path) => {
    const newLines = [...lines]
    const traverse = (node, path, depth) => {
      if (depth === path.length - 1) {
        node.children.splice(path[depth], 1)
      } else {
        traverse(node.children[path[depth]], path, depth + 1)
      }
    }
    traverse(newLines[selectedLineIndex], path, 0)
    setLines(newLines)
  }

  const updateNodeName = (path, value) => {
    const newLines = [...lines]
    const traverse = (node, path, depth) => {
      if (depth === path.length - 1) {
        node.children[path[depth]].name = value
      } else {
        traverse(node.children[path[depth]], path, depth + 1)
      }
    }
    traverse(newLines[selectedLineIndex], path, 0)
    setLines(newLines)
  }

  const addParameter = (path) => {
    const newLines = [...lines]
    const traverse = (node, path, depth) => {
      if (depth === path.length) {
        node.parameters = node.parameters || []
        node.parameters.push({ 
          name: '', 
          unit: '', 
          spec: '',
          USL: '',
          LSL: '',
          UCL: '',
          LCL: '',
          countUCL: '',
          countLCL: '',
          target: '',
          controlLimitMethod: '관리값 사용',
          sigma: '3시그마',
          chartType: 'Xbar-R',
          useNelsonRule: false,
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        })
      } else {
        traverse(node.children[path[depth]], path, depth + 1)
      }
    }
    traverse(newLines[selectedLineIndex], path, 0)
    setLines(newLines)
  }

  const deleteParameter = (path, paramIdx) => {
    const newLines = [...lines]
    const traverse = (node, path, depth) => {
      if (depth === path.length) {
        node.parameters.splice(paramIdx, 1)
      } else {
        traverse(node.children[path[depth]], path, depth + 1)
      }
    }
    traverse(newLines[selectedLineIndex], path, 0)
    setLines(newLines)
  }

  const updateParameter = (path, paramIdx, field, value) => {
    const newLines = [...lines]
    const traverse = (node, path, depth) => {
      if (depth === path.length) {
        node.parameters[paramIdx][field] = value
        // 수정 시 updatedAt 자동 업데이트
        if (field !== 'createdAt' && field !== 'updatedAt') {
          node.parameters[paramIdx].updatedAt = new Date().toISOString()
        }
      } else {
        traverse(node.children[path[depth]], path, depth + 1)
      }
    }
    traverse(newLines[selectedLineIndex], path, 0)
    setLines(newLines)
  }

  const addMetadata = (path) => {
    const newLines = [...lines]
    const traverse = (node, path, depth) => {
      if (depth === path.length) {
        node.metadata = node.metadata || []
        node.metadata.push({ field: '', value: '' })
      } else {
        traverse(node.children[path[depth]], path, depth + 1)
      }
    }
    traverse(newLines[selectedLineIndex], path, 0)
    setLines(newLines)
  }

  const updateMetadata = (path, idx, key, value) => {
    const newLines = [...lines]
    const traverse = (node, path, depth) => {
      if (depth === path.length) {
        node.metadata[idx][key] = value
      } else {
        traverse(node.children[path[depth]], path, depth + 1)
      }
    }
    traverse(newLines[selectedLineIndex], path, 0)
    setLines(newLines)
  }

  const deleteMetadata = (path, idx) => {
    const newLines = [...lines]
    const traverse = (node, path, depth) => {
      if (depth === path.length) {
        node.metadata.splice(idx, 1)
      } else {
        traverse(node.children[path[depth]], path, depth + 1)
      }
    }
    traverse(newLines[selectedLineIndex], path, 0)
    setLines(newLines)
  }

  const renderTree = (nodes, path = []) => (
    <div className="ml-4">
      {nodes.map((node, idx) => {
        const currentPath = [...path, idx]
        return (
          <div key={idx} className="mt-2 p-2 border rounded">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" onClick={() => toggleCollapse(currentPath)}>
                  {node.collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </Button>
                <Input
                  className="w-60"
                  value={node.name}
                  onChange={(e) => updateNodeName(currentPath, e.target.value)}
                  placeholder="공정 명칭"
                />
                <Button size="icon" onClick={() => addNode(currentPath)}><Plus className="w-3 h-3" /></Button>
              </div>
              <Button size="icon" variant="destructive" onClick={() => deleteNode(currentPath)}><Trash2 className="w-3 h-3" /></Button>
            </div>
            {!node.collapsed && renderTree(node.children, currentPath)}
          </div>
        )
      })}
    </div>
  )

  const renderParameterEditor = (nodes, path = []) => (
    <div className="ml-4">
      {nodes.map((node, idx) => {
        const currentPath = [...path, idx]
        return (
          <div key={idx} className="mt-4">
            <div className="flex items-center justify-between mb-1 flex-nowrap gap-2">
              <div className="font-medium">{node.name}</div>
              <div className="flex gap-2">
                <Button size="sm" onClick={() => addParameter(currentPath)}>
                  <Plus className="w-3 h-3 mr-1" /> 파라미터 추가
                </Button>
                <Button size="sm" onClick={() => addMetadata(currentPath)}>
                  <Plus className="w-3 h-3 mr-1" /> 기본정보 항목 추가
                </Button>
              </div>
            </div>
            
            {/* 기본정보 항목 먼저 표시 */}
            {(node.metadata || []).map((meta, metaIdx) => (
              <div key={metaIdx} className="flex items-center gap-2 mb-1 ml-4">
                <Input className="w-40" value={meta.field} onChange={(e) => updateMetadata(currentPath, metaIdx, 'field', e.target.value)} placeholder="기본정보 항목명" />
                <Input className="w-56" value={meta.value} onChange={(e) => updateMetadata(currentPath, metaIdx, 'value', e.target.value)} placeholder="값" />
                <Button size="icon" variant="ghost" onClick={() => deleteMetadata(currentPath, metaIdx)}><Trash2 className="w-4 h-4 text-red-500" /></Button>
              </div>
            ))}
            
            {/* 그 다음 파라미터 표시 */}
            {(node.parameters || []).map((param, paramIdx) => {
              const isExpanded = isParamExpanded(currentPath, paramIdx);
              return (
                <div key={paramIdx} className="border p-3 rounded-lg mb-4 ml-4 bg-gray-50">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2 flex-1">
                      <Input className="w-40 font-medium" value={param.name} onChange={(e) => updateParameter(currentPath, paramIdx, 'name', e.target.value)} placeholder="Parameter Name" />
                      <Input className="w-24" value={param.unit} onChange={(e) => updateParameter(currentPath, paramIdx, 'unit', e.target.value)} placeholder="Unit" />
                      <Input className="w-32" value={param.spec} onChange={(e) => updateParameter(currentPath, paramIdx, 'spec', e.target.value)} placeholder="Spec (e.g., 100~120)" />
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="ml-2"
                        onClick={() => toggleParamExpand(currentPath, paramIdx)}
                      >
                        {isExpanded ? (
                          <><ChevronUp className="w-4 h-4 mr-1" /> 옵션 접기</>
                        ) : (
                          <><ChevronDown className="w-4 h-4 mr-1" /> 옵션 펼치기</>
                        )}
                      </Button>
                    </div>
                    <Button size="icon" variant="ghost" onClick={() => deleteParameter(currentPath, paramIdx)}><Trash2 className="w-4 h-4 text-red-500" /></Button>
                  </div>
                  
                  {isExpanded && (
                    <>
                      <div className="grid grid-cols-3 gap-3">
                        <div>
                          <label className="text-xs font-medium block mb-1">USL (SPEC 상한선)</label>
                          <Input 
                            value={param.USL} 
                            onChange={(e) => updateParameter(currentPath, paramIdx, 'USL', e.target.value)} 
                            placeholder="상한 규격 기준"
                            size="sm"
                          />
                          <p className="text-xs text-gray-500 mt-1">계량형 분석 중 공정능력지수 산출에 사용</p>
                        </div>
                        
                        <div>
                          <label className="text-xs font-medium block mb-1">LSL (SPEC 하한선)</label>
                          <Input 
                            value={param.LSL} 
                            onChange={(e) => updateParameter(currentPath, paramIdx, 'LSL', e.target.value)} 
                            placeholder="하한 규격 기준"
                            size="sm"
                          />
                          <p className="text-xs text-gray-500 mt-1">계량형 분석 중 공정능력지수 산출에 사용</p>
                        </div>
                        
                        <div>
                          <label className="text-xs font-medium block mb-1">Target</label>
                          <Input 
                            value={param.target} 
                            onChange={(e) => updateParameter(currentPath, paramIdx, 'target', e.target.value)} 
                            placeholder="목표값"
                            size="sm"
                          />
                          <p className="text-xs text-gray-500 mt-1">해당 parameter의 Target 값</p>
                        </div>
                        
                        <div>
                          <label className="text-xs font-medium block mb-1">UCL (관리 상한선)</label>
                          <Input 
                            value={param.UCL} 
                            onChange={(e) => updateParameter(currentPath, paramIdx, 'UCL', e.target.value)} 
                            placeholder="상한 관리 기준"
                            size="sm"
                          />
                          <p className="text-xs text-gray-500 mt-1">계량형 분석 중 관리도에 사용</p>
                        </div>
                        
                        <div>
                          <label className="text-xs font-medium block mb-1">LCL (관리 하한선)</label>
                          <Input 
                            value={param.LCL} 
                            onChange={(e) => updateParameter(currentPath, paramIdx, 'LCL', e.target.value)} 
                            placeholder="하한 관리 기준"
                            size="sm"
                          />
                          <p className="text-xs text-gray-500 mt-1">계량형 분석 중 관리도에 사용</p>
                        </div>
                        
                        <div>
                          <label className="text-xs font-medium block mb-1">관리한계선 추정</label>
                          <select 
                            className="w-full rounded-md border border-input px-3 py-2 text-sm"
                            value={param.controlLimitMethod || '관리값 사용'} 
                            onChange={(e) => updateParameter(currentPath, paramIdx, 'controlLimitMethod', e.target.value)}
                          >
                            <option value="관리값 사용">관리값 사용</option>
                            <option value="데이터 추정">데이터 추정</option>
                          </select>
                          <p className="text-xs text-gray-500 mt-1">관리한계선(UCL,LCL) 설정 방법</p>
                        </div>
                        
                        <div>
                          <label className="text-xs font-medium block mb-1">계수형 UCL</label>
                          <Input 
                            value={param.countUCL} 
                            onChange={(e) => updateParameter(currentPath, paramIdx, 'countUCL', e.target.value)} 
                            placeholder="계수형 상한 관리"
                            size="sm"
                          />
                          <p className="text-xs text-gray-500 mt-1">계수형 불량률 분석에 사용</p>
                        </div>
                        
                        <div>
                          <label className="text-xs font-medium block mb-1">계수형 LCL</label>
                          <Input 
                            value={param.countLCL} 
                            onChange={(e) => updateParameter(currentPath, paramIdx, 'countLCL', e.target.value)} 
                            placeholder="계수형 하한 관리"
                            size="sm"
                          />
                          <p className="text-xs text-gray-500 mt-1">계수형 불량률 분석에 사용</p>
                        </div>
                        
                        <div>
                          <label className="text-xs font-medium block mb-1">Sigma</label>
                          <select 
                            className="w-full rounded-md border border-input px-3 py-2 text-sm"
                            value={param.sigma || '3시그마'} 
                            onChange={(e) => updateParameter(currentPath, paramIdx, 'sigma', e.target.value)}
                          >
                            <option value="1시그마">1시그마</option>
                            <option value="2시그마">2시그마</option>
                            <option value="3시그마">3시그마</option>
                          </select>
                          <p className="text-xs text-gray-500 mt-1">시그마 범위 선택</p>
                        </div>
                        
                        <div>
                          <label className="text-xs font-medium block mb-1">차트</label>
                          <select 
                            className="w-full rounded-md border border-input px-3 py-2 text-sm"
                            value={param.chartType || 'Xbar-R'} 
                            onChange={(e) => updateParameter(currentPath, paramIdx, 'chartType', e.target.value)}
                          >
                            <option value="Xbar-R">Xbar-R</option>
                            <option value="Xbar-S">Xbar-S</option>
                            <option value="I-MR">I-MR</option>
                          </select>
                          <p className="text-xs text-gray-500 mt-1">관리도 유형 선택</p>
                        </div>
                        
                        <div>
                          <label className="text-xs font-medium block mb-1">넬슨룰 적용</label>
                          <div className="flex items-center mt-2">
                            <input 
                              type="checkbox" 
                              id={`nelson-${paramIdx}`}
                              className="w-4 h-4 mr-2"
                              checked={param.useNelsonRule || false}
                              onChange={(e) => updateParameter(currentPath, paramIdx, 'useNelsonRule', e.target.checked)}
                            />
                            <label htmlFor={`nelson-${paramIdx}`} className="text-sm">적용</label>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">Nelson rule 적용 여부</p>
                        </div>
                        
                        <div>
                          <label className="text-xs font-medium block mb-1">사용여부</label>
                          <div className="flex items-center mt-2">
                            <input 
                              type="checkbox" 
                              id={`active-${paramIdx}`}
                              className="w-4 h-4 mr-2"
                              checked={param.isActive !== false}
                              onChange={(e) => updateParameter(currentPath, paramIdx, 'isActive', e.target.checked)}
                            />
                            <label htmlFor={`active-${paramIdx}`} className="text-sm">사용</label>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">분석에 사용/미사용 선택</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
                        <div>생성일시: {param.createdAt ? new Date(param.createdAt).toLocaleString() : '없음'}</div>
                        <div>수정일시: {param.updatedAt ? new Date(param.updatedAt).toLocaleString() : '없음'}</div>
                      </div>
                    </>
                  )}
                </div>
              );
            })}
            
            {renderParameterEditor(node.children, currentPath)}
          </div>
        )
      })}
    </div>
  )

  const renderManageContent = () => (
    <Tabs defaultValue="structure" className="w-full">
      <TabsList>
        <TabsTrigger value="structure"><Settings className="w-4 h-4 mr-2" />공정 생성</TabsTrigger>
        <TabsTrigger value="parameter"><FileText className="w-4 h-4 mr-2" />파라미터 정의</TabsTrigger>
      </TabsList>

      <TabsContent value="structure">
        <Card className="mb-4">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-1 flex-nowrap gap-2">
              <Input className="text-lg font-bold w-1/2" value={lines[selectedLineIndex].name} onChange={updateLineName} placeholder="라인 이름" />
              <div className="flex gap-2">
                <Button onClick={() => addNode([])}><Plus className="w-4 h-4 mr-1" /> 공정 추가</Button>
              </div>
            </div>
            {renderTree(lines[selectedLineIndex].children)}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="parameter">
        <Card>
          <CardContent className="p-4">
            {renderParameterEditor(lines[selectedLineIndex].children)}
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )

  const renderAnalysisContent = () => (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">공정 분석</h2>
      <Card>
        <CardContent className="p-4">
          <div className="text-lg text-center py-16">공정 분석 기능은 개발 중입니다.</div>
        </CardContent>
      </Card>
    </div>
  )

  const renderViewContent = () => (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">공정 조회</h2>
      <Card>
        <CardContent className="p-4">
          <div className="text-lg text-center py-16">공정 조회 기능은 개발 중입니다.</div>
        </CardContent>
      </Card>
    </div>
  )

  const renderContent = () => {
    switch(activeMenu) {
      case 'analysis':
        return renderAnalysisContent()
      case 'view':
        return renderViewContent()
      case 'manage':
        return renderManageContent()
      default:
        return renderManageContent()
    }
  }

  return (
    <div className="flex h-screen">
      {/* 사이드바 토글 버튼 (사이드바가 축소된 경우에만 표시) */}
      {sidebarCollapsed && (
        <div className="flex flex-col items-center border-r h-full py-4 bg-gray-100">
          <Button size="icon" variant="ghost" onClick={toggleSidebar} className="mb-4">
            <Menu className="w-5 h-5" />
          </Button>
          <Button 
            size="icon" 
            variant={activeMenu === 'analysis' ? 'default' : 'ghost'} 
            onClick={() => setActiveMenu('analysis')}
            className="mb-2"
            title="공정 분석"
          >
            <BarChart3 className="w-5 h-5" />
          </Button>
          <Button 
            size="icon" 
            variant={activeMenu === 'view' ? 'default' : 'ghost'} 
            onClick={() => setActiveMenu('view')}
            className="mb-2"
            title="공정 조회"
          >
            <Search className="w-5 h-5" />
          </Button>
          <Button 
            size="icon" 
            variant={activeMenu === 'manage' ? 'default' : 'ghost'} 
            onClick={() => setActiveMenu('manage')}
            className="mb-2"
            title="공정 관리"
          >
            <SlidersHorizontal className="w-5 h-5" />
          </Button>
        </div>
      )}

      {/* 왼쪽 메뉴바 (확장된 경우) */}
      {!sidebarCollapsed && (
        <div className="w-60 bg-gray-100 border-r h-full flex flex-col">
          <div className="p-4 font-bold text-xl text-center border-b flex justify-between items-center">
            <span>공정 관리 시스템</span>
            <Button size="icon" variant="ghost" onClick={toggleSidebar}>
              <X className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex flex-col p-2 gap-1">
            <Button 
              variant={activeMenu === 'analysis' ? 'default' : 'ghost'} 
              className="justify-start"
              onClick={() => setActiveMenu('analysis')}
            >
              <BarChart3 className="w-4 h-4 mr-2" /> 공정 분석
            </Button>
            <Button 
              variant={activeMenu === 'view' ? 'default' : 'ghost'} 
              className="justify-start"
              onClick={() => setActiveMenu('view')}
            >
              <Search className="w-4 h-4 mr-2" /> 공정 조회
            </Button>
            <Button 
              variant={activeMenu === 'manage' ? 'default' : 'ghost'} 
              className="justify-start"
              onClick={() => setActiveMenu('manage')}
            >
              <SlidersHorizontal className="w-4 h-4 mr-2" /> 공정 관리
            </Button>
          </div>
        </div>
      )}

      {/* 메인 콘텐츠 영역 */}
      <div className="flex-1 overflow-auto">
        {renderContent()}
      </div>
    </div>
  )
}