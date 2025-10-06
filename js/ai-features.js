class JournalAI {
    constructor() {
        // Initialize sentiment analyzer
        this.sentiment = new sentiment();
        this.embeddings = {};
        this.similarityThreshold = 0.7;
    }

    // Analyze sentiment of text
    analyzeSentiment(text) {
        const result = this.sentiment.analyze(text);
        return {
            score: result.score,
            comparative: result.comparative,
            positive: result.positive,
            negative: result.negative
        };
    }

    // Generate embeddings for text using TensorFlow.js
    async generateEmbedding(text) {
        const model = await use.load();
        const embeddings = await model.embed([text]);
        return embeddings.arraySync()[0];
    }

    // Calculate similarity between two embeddings
    calculateSimilarity(embedding1, embedding2) {
        return cosineSimilarity(embedding1, embedding2);
    }

    // Find similar entries
    async findSimilarEntries(currentEntry, pastEntries) {
        const currentEmbedding = await this.generateEmbedding(currentEntry.reflection);
        
        const similarEntries = [];
        for (const entry of pastEntries) {
            if (!this.embeddings[entry.timestamp]) {
                this.embeddings[entry.timestamp] = await this.generateEmbedding(entry.reflection);
            }
            
            const similarity = this.calculateSimilarity(
                currentEmbedding, 
                this.embeddings[entry.timestamp]
            );
            
            if (similarity > this.similarityThreshold) {
                similarEntries.push({
                    entry,
                    similarity
                });
            }
        }
        
        return similarEntries.sort((a, b) => b.similarity - a.similarity);
    }

    // Generate insights from journal entries
    generateInsights(entries) {
        const moodTrends = this.analyzeMoodTrends(entries);
        const gratitudePatterns = this.analyzeGratitudePatterns(entries);
        const emotionalTriggers = this.identifyEmotionalTriggers(entries);
        
        return {
            moodTrends,
            gratitudePatterns,
            emotionalTriggers,
            recommendations: this.generateRecommendations({
                moodTrends,
                gratitudePatterns,
                emotionalTriggers
            })
        };
    }

    // Analyze mood patterns over time
    analyzeMoodTrends(entries) {
        const moodsByDay = {};
        entries.forEach(entry => {
            const dayOfWeek = new Date(entry.date).getDay();
            if (!moodsByDay[dayOfWeek]) {
                moodsByDay[dayOfWeek] = [];
            }
            moodsByDay[dayOfWeek].push(entry.mood);
        });

        // Calculate average mood by day
        const averageMoods = {};
        for (const [day, moods] of Object.entries(moodsByDay)) {
            averageMoods[day] = moods.reduce((a, b) => a + b, 0) / moods.length;
        }

        return {
            averageMoodsByDay: averageMoods,
            weeklyTrend: this.calculateWeeklyTrend(entries),
            monthlyTrend: this.calculateMonthlyTrend(entries)
        };
    }

    // Analyze patterns in gratitude entries
    analyzeGratitudePatterns(entries) {
        const gratitudeWords = {};
        entries.forEach(entry => {
            entry.gratitude.forEach(item => {
                const words = item.toLowerCase().split(' ');
                words.forEach(word => {
                    if (word.length > 3) { // Skip small words
                        gratitudeWords[word] = (gratitudeWords[word] || 0) + 1;
                    }
                });
            });
        });

        return {
            commonThemes: Object.entries(gratitudeWords)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 5),
            suggestions: this.generateGratitudeSuggestions(gratitudeWords)
        };
    }

    // Identify potential emotional triggers
    identifyEmotionalTriggers(entries) {
        const triggers = {
            positive: new Map(),
            negative: new Map()
        };

        entries.forEach(entry => {
            const sentiment = this.analyzeSentiment(entry.reflection);
            const words = entry.reflection.toLowerCase().split(' ');
            
            words.forEach(word => {
                if (word.length > 3) {
                    if (sentiment.score > 0) {
                        triggers.positive.set(
                            word, 
                            (triggers.positive.get(word) || 0) + 1
                        );
                    } else if (sentiment.score < 0) {
                        triggers.negative.set(
                            word, 
                            (triggers.negative.get(word) || 0) + 1
                        );
                    }
                }
            });
        });

        return {
            positive: Array.from(triggers.positive.entries())
                .sort((a, b) => b[1] - a[1])
                .slice(0, 5),
            negative: Array.from(triggers.negative.entries())
                .sort((a, b) => b[1] - a[1])
                .slice(0, 5)
        };
    }

    // Generate personalized recommendations
    generateRecommendations(insights) {
        const recommendations = [];

        // Mood-based recommendations
        const lowestMoodDay = this.findLowestMoodDay(insights.moodTrends.averageMoodsByDay);
        if (lowestMoodDay) {
            recommendations.push({
                type: 'mood',
                message: `Consider planning enjoyable activities for ${this.getDayName(lowestMoodDay)}, as it tends to be your lower mood day.`
            });
        }

        // Gratitude recommendations
        const commonThemes = insights.gratitudePatterns.commonThemes;
        if (commonThemes.length > 0) {
            recommendations.push({
                type: 'gratitude',
                message: `You often feel grateful for ${commonThemes[0][0]}. Consider exploring more aspects of this in your life.`
            });
        }

        // Trigger-based recommendations
        if (insights.emotionalTriggers.positive.length > 0) {
            recommendations.push({
                type: 'activity',
                message: `Activities involving ${insights.emotionalTriggers.positive[0][0]} seem to boost your mood.`
            });
        }

        return recommendations;
    }

    // Helper functions
    getDayName(dayNumber) {
        return ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][dayNumber];
    }

    findLowestMoodDay(averageMoods) {
        return Object.entries(averageMoods)
            .sort((a, b) => a[1] - b[1])[0][0];
    }

    calculateWeeklyTrend(entries) {
        // Implementation for weekly mood trends
    }

    calculateMonthlyTrend(entries) {
        // Implementation for monthly mood trends
    }

    generateGratitudeSuggestions(commonWords) {
        // Generate personalized gratitude suggestions
    }
}

// Cosine similarity calculation
function cosineSimilarity(a, b) {
    const dotProduct = a.reduce((sum, val, i) => sum + val * b[i], 0);
    const magnitudeA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
    const magnitudeB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
    return dotProduct / (magnitudeA * magnitudeB);
}