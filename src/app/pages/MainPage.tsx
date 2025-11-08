import { useEffect, useState } from "react";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Stepper from "@mui/material/Stepper";
import { ChevronDown, CheckCircle2, X, Plus } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

type StepId = "welcome" | "project" | "extra" | "participants" | "loading" | "board";

const FLOW_STEPS: Array<{ id: StepId; title: string; }> = [
    {
        id: "welcome",
        title: "AI 기반 프로젝트 일정 생성기",

    },
    {
        id: "project",
        title: "프로젝트 정보 입력",

    },
    {
        id: "extra",
        title: "추가 정보 입력",

    },
    {
        id: "participants",
        title: "참여자 정보 입력",
    },
    {
        id: "loading",
        title: "일정 생성 중...",

    },
    {
        id: "board",
        title: "생성된 프로젝트 확인",

    },
];

const LOADING_TIME = 14000;

const LOADING_MESSAGES = [
    "뤼이도 AI가 성공적으로 프로젝트 정보를 반영했습니다",
    "뤼이도 AI가 추가정보를 반영 중입니다",
    "뤼이도 AI가 당신의 프로젝트를 최적화 중입니다",
    "뤼이도 AI를 통해 효율적으로 프로젝트를  관리하세요!",
];

const STEPPER_STEPS = FLOW_STEPS.filter(
    (step) => step.id !== "welcome" && step.id !== "loading",
);

const TEAM_OPTIONS = ["개발 2팀"];
const INITIAL_POSITION_OPTIONS = ["프론트엔드 개발자", "백엔드 개발자", "DevOps 개발자", "디자이너", "PM"];
const EXPERIENCE_OPTIONS = ["경력을 선택해 주세요", "신입 (0년차)", "주니어 (1~3년차)", "미들 (3~10년차)", "시니어 (10년 이상)", "리더 (10년 이상)"];

const PARTICIPANTS = [
    { id: 1, name: "김정원", roleType: "admin" as const, included: true },
    { id: 2, name: "김예나", roleType: "member" as const, included: true },
    { id: 3, name: "박진홍", roleType: "member" as const, included: false },
    { id: 4, name: "강동학", roleType: "member" as const, included: true },
    { id: 5, name: "최정윤", roleType: "member" as const, included: false },
    { id: 6, name: "전중환", roleType: "member" as const, included: false }
];

const BOARD_ITEMS_TEMPLATE = [
    { id: 1, name: "프로젝트 킥오프 미팅", deadline: "2025-11-12" },
    { id: 2, name: "요구사항 분석 및 설계", deadline: "2025-11-19" },
    { id: 3, name: "디자인 기획 및 초안 제작", deadline: "2025-11-26" },
    { id: 4, name: "백엔드 구조 설계", deadline: "2025-11-26" },
    { id: 5, name: "프론트엔드 컴포넌트 구축", deadline: "2025-11-26" },
    { id: 6, name: "통합 테스트 및 버그 처리", deadline: "2025-12-12" },
    { id: 7, name: "런칭 체크리스트 리뷰 & 시연", deadline: "2025-12-19" },
];

// Component for participant row with local state
function ParticipantRow({
    participant,
    included,
    onIncludedChange,
    positionOptions,
    onAddPosition,
    onRemovePosition
}: {
    participant: typeof PARTICIPANTS[0];
    included: boolean;
    onIncludedChange: (included: boolean) => void;
    positionOptions: string[];
    onAddPosition: (position: string) => void;
    onRemovePosition: (position: string) => void;
}) {
    const [position, setPosition] = useState("");
    const [experience, setExperience] = useState("");
    const [newPosition, setNewPosition] = useState("");

    return (
        <TableRow data-state={included ? "selected" : undefined}>
            <TableCell style={{ width: "10px" }}>
                <Checkbox
                    checked={included}
                    onCheckedChange={(value) => onIncludedChange(!!value)}
                    aria-label="Select row"
                />
            </TableCell>
            <TableCell style={{ width: "220px" }}>
                <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                        <AvatarFallback className="text-sm font-medium">
                            {participant.name.slice(0, 1)}
                        </AvatarFallback>
                    </Avatar>
                    <p className="text-base text-primary">
                        {participant.name}
                    </p>
                </div>
            </TableCell>
            <TableCell style={{ width: "220px" }}>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <button className="flex w-full items-center justify-between rounded-lg border border-primary/20 bg-white px-3 py-2 text-sm text-primary outline-none transition hover:border-brand focus:border-brand">
                            <span>{position || "직군/담당을 입력해 주세요"}</span>
                            <ChevronDown className="h-4 w-4 opacity-50" />
                        </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="center" className="w-51.5">
                        {positionOptions.map((option) => (
                            <div
                                key={option}
                                className="flex items-center justify-between px-2 py-1.5 text-sm cursor-pointer hover:bg-tertiary rounded-md group"
                            >
                                <span
                                    className="flex-1"
                                    onClick={() => setPosition(option)}
                                >
                                    {option}
                                </span>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onRemovePosition(option);
                                        if (position === option) setPosition("");
                                    }}
                                    className="opacity-0 group-hover:opacity-100 p-1 hover:bg-white rounded transition-opacity"
                                >
                                    <X className="h-3 w-3 text-primary" />
                                </button>
                            </div>
                        ))}
                        <div className="mt-1 pt-1 px-1.5 pb-2">
                            <div className="flex items-center">
                                <input
                                    type="text"
                                    value={newPosition}
                                    onChange={(e) => setNewPosition(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter" && newPosition.trim()) {
                                            onAddPosition(newPosition.trim());
                                            setNewPosition("");
                                        }
                                    }}
                                    placeholder="추가하기"
                                    className="w-full rounded border border-primary/20 px-2 py-1.5 text-sm text-primary outline-none focus:border-primary"
                                />
                                <button
                                    onClick={() => {
                                        if (newPosition.trim()) {
                                            onAddPosition(newPosition.trim());
                                            setNewPosition("");
                                        }
                                    }}
                                    className="rounded hover:bg-tertiary"
                                >
                                    <Plus className="h-4 w-4 ml-1.5 text-primary" />
                                </button>
                            </div>
                        </div>
                    </DropdownMenuContent>
                </DropdownMenu>
            </TableCell>
            <TableCell style={{ width: "220px" }}>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <button className="flex w-full items-center justify-between rounded-lg border border-primary/20 bg-white px-3 py-2 text-sm text-primary outline-none transition hover:border-brand focus:border-brand">
                            <span>{experience || "경력을 선택해 주세요"}</span>
                            <ChevronDown className="h-4 w-4 opacity-50" />
                        </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="center" className="w-51.5">
                        {EXPERIENCE_OPTIONS.map((option) => (
                            <DropdownMenuItem
                                key={option}
                                onClick={() => setExperience(option)}
                            >
                                {option}
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>
            </TableCell>
            <TableCell style={{ width: "60px" }}>
                <Badge variant={participant.roleType === "admin" ? "admin" : "member"}>
                    {participant.roleType === "admin" ? "관리자" : "멤버"}
                </Badge>
            </TableCell>
        </TableRow>
    );
}

// Component for board item row with local state
function BoardItemRow({
    item,
    checked,
    onCheckedChange,
    participantOptions,
    defaultParticipant
}: {
    item: typeof BOARD_ITEMS_TEMPLATE[0];
    checked: boolean;
    onCheckedChange: (checked: boolean) => void;
    participantOptions: string[];
    defaultParticipant: string;
}) {
    const [name, setName] = useState(item.name);
    const [participant, setParticipant] = useState(defaultParticipant);
    const [isEditingName, setIsEditingName] = useState(false);

    return (
        <TableRow data-state={checked ? "selected" : undefined}>
            <TableCell style={{ width: "6px" }}>
                <ChevronDown className="h-4 w-4 text-primary opacity-50 ml-2" />
            </TableCell>
            <TableCell style={{ width: "10px" }}>
                <Checkbox
                    checked={checked}
                    onCheckedChange={(value) => onCheckedChange(!!value)}
                    aria-label="Select row"
                />
            </TableCell>
            <TableCell style={{ width: "300px" }}>
                {isEditingName ? (
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        onBlur={() => setIsEditingName(false)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                setIsEditingName(false);
                            }
                        }}
                        autoFocus
                        className="w-full rounded-md border border-primary bg-white px-2 py-1 text-base text-primary outline-none transition"
                    />
                ) : (
                    <button
                        onClick={() => setIsEditingName(true)}
                        className="text-left text-base text-primary cursor-pointer w-full"
                    >
                        {name}
                    </button>
                )}
            </TableCell>
            <TableCell style={{ width: "160px" }}>
                <p className="text-base text-primary">
                    {item.deadline}
                </p>
            </TableCell>
            <TableCell style={{ width: "160px" }}>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <button className="flex w-full items-center justify-between rounded-lg border border-primary/20 bg-white px-3 py-2 text-sm text-primary outline-none transition hover:border-brand focus:border-brand">
                            <span>{participant}</span>
                            <ChevronDown className="h-4 w-4 opacity-50" />
                        </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="center" className="w-36 text-primary">
                        {participantOptions.map((option) => (
                            <DropdownMenuItem
                                key={option}
                                onClick={() => setParticipant(option)}
                            >
                                {option}
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>
            </TableCell>
            <TableCell style={{ width: "100px" }}>
                <Badge variant="member" className="px-2">
                    완료하기
                </Badge>
            </TableCell>
            <TableCell style={{ width: "160px" }}>
                {/* 빈 열 */}
            </TableCell>
        </TableRow>
    );
}

function MainPage() {
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [boardCheckedItems, setBoardCheckedItems] = useState<Record<number, boolean>>(() => {
        const initialChecked: Record<number, boolean> = {};
        BOARD_ITEMS_TEMPLATE.forEach(item => {
            initialChecked[item.id] = true;
        });
        return initialChecked;
    });
    const [participantsIncluded, setParticipantsIncluded] = useState<Record<number, boolean>>(() => {
        const initial: Record<number, boolean> = {};
        PARTICIPANTS.forEach(p => {
            initial[p.id] = p.included;
        });
        return initial;
    });
    const [positionOptions, setPositionOptions] = useState<string[]>(INITIAL_POSITION_OPTIONS);
    const [loadingProgress, setLoadingProgress] = useState(0);
    const [visibleMessages, setVisibleMessages] = useState<number[]>([]);

    // Project form state
    const [projectTopic, setProjectTopic] = useState("");
    const [projectDeadline, setProjectDeadline] = useState("");

    const currentStep = FLOW_STEPS[currentStepIndex];

    // Get selected participants
    const selectedParticipants = PARTICIPANTS.filter(p => participantsIncluded[p.id]).map(p => p.name);
    const defaultParticipant = selectedParticipants[0] || "김예나";

    // Position management functions
    const handleAddPosition = (position: string) => {
        if (!positionOptions.includes(position)) {
            setPositionOptions([...positionOptions, position]);
        }
    };

    const handleRemovePosition = (position: string) => {
        setPositionOptions(positionOptions.filter(p => p !== position));
    };

    useEffect(() => {
        if (currentStep.id !== "loading") {
            setLoadingProgress(0);
            setVisibleMessages([]);
            return;
        }

        // Progress animation
        const progressInterval = setInterval(() => {
            setLoadingProgress((prev) => {
                if (prev >= 100) return 100;
                return prev + 100 / (LOADING_TIME / 50);
            });
        }, 50);

        // Messages animation
        const messageInterval = LOADING_TIME / LOADING_MESSAGES.length;
        const messageTimeouts: number[] = [];

        LOADING_MESSAGES.forEach((_, index) => {
            const timeoutId = window.setTimeout(() => {
                setVisibleMessages((prev) => [...prev, index]);
            }, messageInterval * index);
            messageTimeouts.push(timeoutId);
        });

        // Navigate to board
        const boardTimeoutId = window.setTimeout(() => {
            const boardIndex = FLOW_STEPS.findIndex((step) => step.id === "board");
            setCurrentStepIndex(boardIndex === -1 ? currentStepIndex : boardIndex);
        }, LOADING_TIME);

        return () => {
            clearInterval(progressInterval);
            messageTimeouts.forEach((id) => window.clearTimeout(id));
            window.clearTimeout(boardTimeoutId);
        };
    }, [currentStep.id, currentStepIndex]);

    const activeStepperIndex = (() => {
        if (currentStep.id === "loading") {
            return 2; // 3번째 step (participants)
        }

        const foundIndex = STEPPER_STEPS.findIndex((step) => step.id === currentStep.id);

        if (foundIndex >= 0) {
            return foundIndex;
        }

        if (currentStep.id === "welcome") {
            return 0;
        }

        return STEPPER_STEPS.length - 1;
    })();

    const handlePrev = () => {
        setCurrentStepIndex((prev) => (prev === 0 ? 0 : prev - 1));
    };

    const handleNext = () => {
        if (currentStep.id === "board") {
            setCurrentStepIndex(0);
            return;
        }

        setCurrentStepIndex((prev) => Math.min(prev + 1, FLOW_STEPS.length - 1));
    };

    const handleBackToProject = () => {
        const projectIndex = FLOW_STEPS.findIndex((step) => step.id === "project");
        setCurrentStepIndex(projectIndex === -1 ? 1 : projectIndex);
    };

    const canGoBack = currentStepIndex > 0;
    const showNextButton = currentStep.id !== "loading";

    const boardCheckedCount = Object.values(boardCheckedItems).filter(Boolean).length;

    // Validation for project form
    const isProjectFormValid = projectTopic.trim() !== "" && projectDeadline !== "";
    const isNextButtonDisabled = currentStep.id === "project" && !isProjectFormValid;

    const nextLabel = (() => {
        if (currentStep.id === "welcome") {
            return "시작하기";
        }

        if (currentStep.id === "participants") {
            return "일정 생성";
        }

        if (currentStep.id === "board") {
            return `선택 항목 추가 (${boardCheckedCount}개)`;
        }

        return "다음";
    })();

    return (
        <div className="min-h-screen bg-white text-primary relative overflow-hidden">
            <img 
                src="/bg.png" 
                alt="background" 
                className="absolute inset-0 w-full h-full object-cover object-top-left"
            />
            <div className="absolute inset-0 bg-black opacity-20" />
            <div className="flex min-h-screen items-center justify-center relative z-10">
                <div className="flex h-[640px] w-[1000px] flex-col rounded-2xl border-2 border-primary bg-white shadow-lg">
                    <div className="flex h-full flex-col gap-2">
                        <header className="flex flex-col gap-2 mb-6">
                            <p className="flex flex-row justify-between text-base font-medium text-primary border-b px-6 py-4">
                                Riido AI
                                <X className="h-6 w-6 text-primary cursor-pointer" />
                            </p>

                        </header>

                        {currentStep.id !== "welcome" &&
                            <div className="flex justify-center px-6">
                                <Stepper
                                    activeStep={activeStepperIndex}
                                    alternativeLabel
                                    sx={{
                                        maxWidth: '480px',
                                        width: '100%',
                                        '& .MuiStepConnector-root': {
                                            top: '12px',
                                            left: 'calc(-50% + 14px)',
                                            right: 'calc(50% + 14px)',
                                        },
                                        '& .MuiStepConnector-line': {
                                            borderColor: '#e5e7eb',
                                            borderTopWidth: '5px',
                                        },
                                        '& .MuiStepConnector-root.Mui-active .MuiStepConnector-line': {
                                            borderColor: '#5D4FF9',
                                        },
                                        '& .MuiStepConnector-root.Mui-completed .MuiStepConnector-line': {
                                            borderColor: '#5D4FF9',
                                        },
                                    }}
                                >
                                    {STEPPER_STEPS.map((step) => (
                                        <Step
                                            key={step.id}
                                            sx={{
                                                '& .MuiStepLabel-root': {
                                                    padding: '0',
                                                },
                                                '& .MuiStepLabel-iconContainer': {
                                                    paddingRight: 0,
                                                },
                                                '& .MuiStepLabel-labelContainer': {
                                                    marginTop: '-8px',
                                                },
                                                '& .MuiStepLabel-label': {
                                                    fontSize: '12px',
                                                    fontWeight: 500,
                                                    color: '#545F7100',
                                                },
                                                '& .MuiStepLabel-label.Mui-active': {
                                                    color: '#5D4FF9',
                                                },
                                                '& .MuiStepLabel-label.Mui-completed': {
                                                    color: '#5D4FF9',
                                                },
                                                '& .MuiStepIcon-root': {
                                                    width: '28px',
                                                    height: '28px',
                                                    color: '#e5e7eb',
                                                },
                                                '& .MuiStepIcon-root.Mui-active': {
                                                    color: '#5D4FF9',
                                                },
                                                '& .MuiStepIcon-root.Mui-completed': {
                                                    color: '#5D4FF9',
                                                },
                                                '& .MuiStepIcon-text': {
                                                    fill: '#ffffff',
                                                    fontSize: '12px',
                                                    fontWeight: 600,
                                                },
                                            }}
                                        >
                                            <StepLabel>
                                                {step.title}
                                            </StepLabel>
                                        </Step>
                                    ))}
                                </Stepper>
                            </div>
                        }

                        <div className="flex-1 overflow-auto py-4 px-6">
                            {currentStep.id === "welcome" ? (
                                <div className="flex flex-col gap-4 items-center">
                                    <p className="text-base text-primary text-center">
                                        Riido AI는 번거로운 프로젝트 일정 생성과 관리를 대신 해줘요.<br />
                                        프로젝트 목적, 내용 등의 정보만 입력하면 예시와 같이 프로젝트 일정이 바로 생성돼요.
                                    </p>
                                    <div className="flex flex-col justify-start">
                                        <p className="text-sm text-secondary">결과 예시</p>
                                        <img src="/image.png" alt="example" className="w-[720px]" />
                                    </div>
                                </div>
                            ) : null}

                            {currentStep.id === "project" ? (
                                <div className="flex flex-col items-center">
                                    <div className="w-[500px] flex flex-col gap-6">
                                        <section className="flex flex-col gap-2">
                                            <h2 className="text-base font-semibold text-primary">
                                                팀 *
                                            </h2>
                                            <select
                                                defaultValue={TEAM_OPTIONS[0]}
                                                className="rounded-xl border border-primary/20 bg-white px-4 py-3 text-primary outline-none transition focus:border-brand focus:shadow-[0_0_0_3px_rgba(93,79,249,0.15)] appearance-none cursor-pointer"
                                                style={{
                                                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='%23000000' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
                                                    backgroundRepeat: 'no-repeat',
                                                    backgroundPosition: 'right 0.75rem center',
                                                    backgroundSize: '1.25rem',
                                                    paddingRight: '2.5rem'
                                                }}
                                            >
                                                {TEAM_OPTIONS.map((team) => (
                                                    <option key={team} value={team}>
                                                        {team}
                                                    </option>
                                                ))}
                                            </select>
                                        </section>

                                        <label className="flex flex-col gap-2 text-sm text-primary opacity-80">
                                            <h2 className="text-base font-semibold text-primary">
                                                프로젝트 주제 *
                                            </h2>
                                            <input
                                                value={projectTopic}
                                                onChange={(e) => setProjectTopic(e.target.value)}
                                                placeholder="예: 회의실 및 공용 자원 예약 웹 기반 시스템 개발"
                                                className="rounded-xl text-base border border-primary/20 bg-white px-4 py-3 text-primary outline-none transition focus:border-brand focus:shadow-[0_0_0_3px_rgba(93,79,249,0.15)]"
                                            />
                                        </label>

                                        <label className="flex flex-col gap-2 text-sm text-primary opacity-80">
                                            <h2 className="text-base font-semibold text-primary">
                                                프로젝트 마감 기한 *
                                            </h2>
                                            <input
                                                type="date"
                                                value={projectDeadline}
                                                onChange={(e) => setProjectDeadline(e.target.value)}
                                                className="rounded-xl border text-base border-primary/20 bg-white px-4 py-3 text-primary outline-none transition focus:border-brand focus:shadow-[0_0_0_3px_rgba(93,79,249,0.15)]"
                                            />
                                        </label>
                                    </div>
                                </div>
                            ) : null}

                            {currentStep.id === "extra" ? (
                                <div className="flex flex-col items-center">
                                    <div className="w-[500px] flex flex-col gap-8">
                                        <section className="flex flex-col gap-2 text-primary opacity-80">
                                            <div className="flex items-center gap-1">
                                                <span className="text-base font-semibold text-primary">프로젝트 예산</span>
                                                <p className="text-sm text-primary opacity-80">(선택)</p>
                                            </div>
                                            <input
                                                type="text"
                                                defaultValue=""
                                                placeholder="100,000,000"
                                                className="rounded-xl border border-primary/20 bg-white px-4 py-3 text-primary outline-none transition focus:border-brand focus:shadow-[0_0_0_3px_rgba(93,79,249,0.15)]"
                                            />
                                        </section>

                                        <section className="flex flex-col gap-2 text-primary opacity-80">
                                            <div className="flex items-center gap-1">
                                                <span className="text-base font-semibold text-primary">개발 스택</span>
                                                <p className="text-sm text-primary opacity-80">(선택)</p>
                                            </div>
                                            <textarea
                                                defaultValue=""
                                                placeholder="백엔드(Spring Boot, MySQL), 프론트엔드(React), DevOps(AWS, Docker)"
                                                rows={3}
                                                className="rounded-xl border text-base border-primary/20 bg-white px-4 py-3 text-primary outline-none transition focus:border-brand focus:shadow-[0_0_0_3px_rgba(93,79,249,0.15)]"
                                            />
                                        </section>

                                        <section className="flex flex-col gap-2 text-sm text-primary opacity-80">
                                            <div className="flex items-center gap-1">
                                                <span className="text-base font-semibold text-primary">기타 요구사항</span>
                                                <p className="text-sm text-primary opacity-80">(선택)</p>
                                            </div>
                                            <textarea
                                                defaultValue=""
                                                placeholder={`- 테스트 코드 커버리지 80% 이상 달성 필요\n- QA 기간 확보`}
                                                rows={3}
                                                className="rounded-xl border text-base border-primary/20 bg-white px-4 py-3 text-primary outline-none transition focus:border-brand focus:shadow-[0_0_0_3px_rgba(93,79,249,0.15)]"
                                            />
                                        </section>
                                    </div>
                                </div>
                            ) : null}

                            {currentStep.id === "participants" ? (
                                <div className="flex flex-col items-center">
                                    <div className="w-[800px] mb-3">
                                        <h2 className="text-base font-semibold text-primary">
                                            프로젝트 참여자 정보
                                        </h2>
                                    </div>
                                    <div className="relative max-h-[310px] w-[800px] overflow-auto rounded-2xl border border-primary/10 bg-white">
                                        <Table className="w-full scrollbar-hide">
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead style={{ width: "10px" }}>
                                                        <Checkbox aria-label="Select all" />
                                                    </TableHead>
                                                    <TableHead style={{ width: "220px" }}>이름*</TableHead>
                                                    <TableHead style={{ width: "220px" }}>직군/담당</TableHead>
                                                    <TableHead style={{ width: "220px" }}>경력</TableHead>
                                                    <TableHead style={{ width: "60px" }}>역할*</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {PARTICIPANTS.map((participant) => (
                                                    <ParticipantRow
                                                        key={participant.id}
                                                        participant={participant}
                                                        included={participantsIncluded[participant.id]}
                                                        onIncludedChange={(included) => {
                                                            setParticipantsIncluded(prev => ({
                                                                ...prev,
                                                                [participant.id]: included
                                                            }));
                                                        }}
                                                        positionOptions={positionOptions}
                                                        onAddPosition={handleAddPosition}
                                                        onRemovePosition={handleRemovePosition}
                                                    />
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </div>
                                </div>
                            ) : null}

                            {currentStep.id === "loading" ? (
                                <div className="flex flex-col items-center">
                                    <div className="w-[400px]">
                                        {/* Header with title and progress */}
                                        <div className="flex items-center mb-3">
                                            <h2 className="text-base mr-1 font-semibold text-primary">
                                                프로젝트 생성 중...
                                            </h2>
                                            <div className="flex items-center gap-1">
                                                <span className="text-lg w-[25px] font-medium text-primary">
                                                    {Math.round(loadingProgress)}
                                                </span>
                                                <span className="text-lg font-medium text-primary">
                                                    %
                                                </span>
                                                <div className="relative h-5 w-5">
                                                    <svg className="h-5 w-5 -rotate-90">
                                                        <circle
                                                            cx="10"
                                                            cy="10"
                                                            r="8"
                                                            stroke="#e5e7eb"
                                                            strokeWidth="2.5"
                                                            fill="none"
                                                        />
                                                        <circle
                                                            cx="10"
                                                            cy="10"
                                                            r="8"
                                                            stroke="#545F71"
                                                            strokeWidth="2.5"
                                                            fill="none"
                                                            strokeDasharray={`${2 * Math.PI * 8}`}
                                                            strokeDashoffset={`${2 * Math.PI * 8 * (1 - loadingProgress / 100)}`}
                                                            style={{ transition: 'stroke-dashoffset 0.1s ease-out' }}
                                                        />
                                                    </svg>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Alert boxes */}
                                        <div className="flex flex-col gap-2">
                                            {visibleMessages.map((messageIndex) => {
                                                const position = visibleMessages.length - 1 - visibleMessages.indexOf(messageIndex);
                                                const opacity = position === 0 ? 1 : position === 1 ? 0.6 : position === 2 ? 0.4 : 0.2;

                                                return (
                                                    <div
                                                        key={messageIndex}
                                                        className="flex items-center gap-2 rounded-lg border border-primary/20 bg-tertiary px-3.5 py-3 text-base text-primary transition-all duration-500 ease-out"
                                                        style={{
                                                            opacity,
                                                            transform: `translateY(${position * 0}px)`,
                                                        }}
                                                    >
                                                        <CheckCircle2 className="h-5 w-5 text-primary shrink-0" />
                                                        <span>{LOADING_MESSAGES[messageIndex]}</span>
                                                    </div>
                                                );
                                            }).reverse()}
                                        </div>
                                    </div>
                                </div>
                            ) : null}

                            {currentStep.id === "board" ? (
                                <div className="flex flex-col">
                                    <div className="mb-3">
                                        <h2 className="text-base font-semibold text-primary">
                                            {LOADING_TIME / 1000}초만에 프로젝트 일정이 만들어졌어요!
                                        </h2>
                                    </div>
                                    <div className="relative max-h-[310px] w-full overflow-auto rounded-lg border border-sec bg-white">
                                        <Table className="w-full scrollbar-hide">
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead style={{ width: "6px" }}></TableHead>
                                                    <TableHead style={{ width: "10px" }}>
                                                        <Checkbox aria-label="Select all" />
                                                    </TableHead>
                                                    <TableHead style={{ width: "300px" }}>이름</TableHead>
                                                    <TableHead style={{ width: "140px" }}>마감일</TableHead>
                                                    <TableHead style={{ width: "160px" }}>참여자</TableHead>
                                                    <TableHead style={{ width: "100px" }}>상태</TableHead>
                                                    <TableHead style={{ width: "80px" }}>현황</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {BOARD_ITEMS_TEMPLATE.map((item) => (
                                                    <BoardItemRow
                                                        key={item.id}
                                                        item={item}
                                                        checked={!!boardCheckedItems[item.id]}
                                                        onCheckedChange={(checked) => {
                                                            setBoardCheckedItems(prev => ({
                                                                ...prev,
                                                                [item.id]: checked
                                                            }));
                                                        }}
                                                        participantOptions={selectedParticipants}
                                                        defaultParticipant={defaultParticipant}
                                                    />
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </div>
                                </div>
                            ) : null}
                        </div>

                        <footer className={`shrink-0 p-6 ${currentStep.id === 'welcome' ? 'flex justify-center' : 'grid grid-cols-2 items-center gap-4'}`}>
                            {currentStep.id === 'welcome' ? (
                                <button
                                    type="button"
                                    onClick={handleNext}
                                    className="rounded-lg bg-brand px-5 py-2.5 font-semibold text-white text-base transition cursor-pointer"
                                    style={{ minWidth: "180px" }}
                                >
                                    {nextLabel}
                                </button>
                            ) : (
                                <>
                                    <div>
                                        {currentStep.id === "board" ? (
                                            <button
                                                type="button"
                                                onClick={handleBackToProject}
                                                className="rounded-lg bg-tertiary px-5 py-2.5 font-semibold text-primary text-base transition cursor-pointer"
                                            >
                                                프로젝트 보드 다시 생성
                                            </button>
                                        ) : canGoBack ? (
                                            <button
                                                type="button"
                                                onClick={handlePrev}
                                                className="rounded-lg w-[80px] bg-tertiary px-5 py-2.5 font-semibold text-primary text-base transition cursor-pointer"
                                            >
                                                뒤로
                                            </button>
                                        ) : (
                                            <div aria-hidden="true" className="h-10 w-[116px]" />
                                        )}
                                    </div>
                                    <div className="flex justify-end">
                                        {showNextButton &&
                                            <button
                                                type="button"
                                                onClick={handleNext}
                                                disabled={isNextButtonDisabled}
                                                className={`rounded-lg px-5 py-2.5 font-semibold text-base transition ${isNextButtonDisabled
                                                        ? "bg-tertiary text-primary cursor-not-allowed"
                                                        : "bg-brand text-white cursor-pointer"
                                                    }`}
                                                style={{ minWidth: currentStep.id === "board" ? "180px" : "180px" }}
                                            >
                                                {nextLabel}
                                            </button>
                                        }
                                    </div>
                                </>
                            )}
                        </footer>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MainPage;
