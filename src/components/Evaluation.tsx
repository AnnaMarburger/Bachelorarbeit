import { ChoiceQuestionDto, LikertQuestionDto, NumberQuestionDto, QuestionnaireInstanceDetailsDto, SliderQuestionDto } from "@api/TenantAPIClient";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { useTranslation } from "react-i18next";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Legend);

// calculate questionnaire score based on answer values
export function evaluateQuestionnaire(questionnaire: QuestionnaireInstanceDetailsDto): number {
    let score: number = 0;

    questionnaire.pages.forEach(page => {
        page.contents.forEach(item => {
            if (item instanceof SliderQuestionDto || item instanceof NumberQuestionDto) {
                const sliderValue = item.answer?.value ?? 0;
                score += sliderValue;
            } else if (item instanceof ChoiceQuestionDto) {
                const id = item.answer?.values ? item.answer.values[0] : null;
                const choiceValue = id ? Number(item.choices.find(c => c.id === id)?.value ?? 0) : 0;
                score += choiceValue;
            } else if (item instanceof LikertQuestionDto) {
                const id = item.answer?.value ?? null;
                const scaleValue = id ? Number(item.scale.find(c => c.id === id)?.value ?? 0) : 0;
                score += scaleValue;
            }
        });
    });
    return score;
}


export function LineChart({ evaluation }: { evaluation: { name: string; scores: number[] }[] }) {
    const { t } = useTranslation();
    
    const maxLength = Math.max(...evaluation.map((q) => q.scores.length));
    const colors = [
        "rgb(255, 199, 154)",
        "rgb(253, 215, 175)", 
        "rgb(252, 225, 195)",
        "rgb(219, 198, 166)", 
        "rgb(255, 214, 159)",   
      ];

    const chartData = {
        labels: Array.from({ length: maxLength }, (_, i) => ""),
        datasets: evaluation.map((q, index) => ({
            label: q.name,
            data: q.scores.length > 0
                ? [...q.scores, ...Array(maxLength - q.scores.length).fill(null)]
                : Array(maxLength).fill(null),
            borderColor: colors[index % colors.length],
            backgroundColor: colors[index % colors.length],
            tension: 0.1,
        })),
    };

    return (
        <Line
            data={chartData}
            options={{
                responsive: true,
                layout: { padding: {top: 20 }},
                plugins: {
                    legend: {
                        display: true, 
                        labels: {  color: "#FFFFFF" },
                        position: "bottom"
                    }
                },
                scales: {
                    y: {
                        title: { display: true, text: t("HomeScreen.Stats.YLabel"), color: "#FFFFFF" },
                        ticks: {color: "#FFFFFF"},
                        beginAtZero: true,
                    }
                },
            }}
        />
    );
}


