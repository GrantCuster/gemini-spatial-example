export const average = (a: number, b: number) => (a + b) / 2;

export function getSvgPathFromStroke(
  points: [number, number, number][],
  closed = true,
) {
  const len = points.length;

  if (len < 4) {
    return ``;
  }

  let a = points[0];
  let b = points[1];
  const c = points[2];

  let result = `M${a[0].toFixed(2)},${a[1].toFixed(2)} Q${b[0].toFixed(
    2,
  )},${b[1].toFixed(2)} ${average(b[0], c[0]).toFixed(2)},${average(
    b[1],
    c[1],
  ).toFixed(2)} T`;

  for (let i = 2, max = len - 1; i < max; i++) {
    a = points[i];
    b = points[i + 1];
    result += `${average(a[0], b[0]).toFixed(2)},${average(a[1], b[1]).toFixed(
      2,
    )} `;
  }

  if (closed) {
    result += "Z";
  }

  return result;
}

export function extractJSONFromMarkdown(markdown: string) {
  const json = markdown.match(/```json\n([\s\S]+?)\n```/);
  if (json) {
    return json[1];
  }
  return markdown;
}

export function replaceLinkFormat(input: string): string {
  return input.replace(
    /\[([^\]]+)\]\((\d+ \d+ \d+ \d+)\)/g,
    (_, text, numbers) => {
      const formattedNumbers = numbers.replace(/ /g, "-");
      return `[${text}](#bb-${formattedNumbers})`;
    },
  );
}


type ParsedResult = {
    text: string;
    numbers: [number, number, number, number];
};

export function parseBoundingBoxes(input: string): ParsedResult[] {
    const regex = /\[([^\]]+)\]\((\d+) (\d+) (\d+) (\d+)\)/g;
    const results: ParsedResult[] = [];
    let match;

    while ((match = regex.exec(input)) !== null) {
        const text = match[1];
        const numbers = [parseInt(match[2]), parseInt(match[3]), parseInt(match[4]), parseInt(match[5])] as [number, number, number, number];
        results.push({ text, numbers });
    }

    return results;
}
