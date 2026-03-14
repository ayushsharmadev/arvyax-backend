# Architecture Design - AI-Assisted Journal System

This document outlines the high-level architectural design and scaling strategies for the AI-Assisted Journal System.

## System Architecture

### High-Level Design

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend API   │    │   Database      │
│   (React/Next)  │◄──►│  (Node.js/      │◄──►│  (PostgreSQL)   │
│                 │    │   Express)      │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                              │
                              ▼
                       ┌─────────────────┐
                       │   LLM Service   │
                       │  (Google Gemini)│
                       └─────────────────┘
```

### Core Components

1. **API Layer**: Express.js REST endpoints for journal operations
2. **Journal Service**: Handles journal entry creation and retrieval
3. **Analysis Service**: Integrates with LLM for emotion analysis
4. **Insights Service**: Aggregates user data for mental health insights
5. **Database Layer**: PostgreSQL with Prisma ORM for data persistence

## API Routes Architecture

### Journal Management
- `POST /api/journal` - Create new journal entry
- `GET /api/journal/:userId` - Retrieve user's journal entries

### Analysis Pipeline
- `POST /api/journal/analyze/:journalId` - Analyze journal text for emotions
- Analysis results stored in database for future reference

### Insights Generation
- `GET /api/journal/insights/:userId` - Generate user mental health insights
- Real-time aggregation of emotions, ambience preferences, and keywords

## LLM Integration Architecture

### Analysis Flow
1. Journal entry created 
2. anlysis journal with Google Gemini structured prompt
3. Response parsed and stored in Analysis table
4. Results cached to avoid repeated API calls

### Data Flow
```
Journal Text → LLM (Gemini) → Structured Response → Database Storage
```

## Insights Generation Architecture

### Data Aggregation Strategy
- Database queries aggregate user's journal history
- Calculate emotion frequencies, ambience preferences
- Extract trending keywords from recent entries
- Return consolidated insights for mental health tracking

## Scaling to 100k Users

### Database Scaling
- **Read Replicas**: Separate read operations for journal retrieval and insights
- **Connection Pooling**: Manage database connections efficiently
- **Indexing Strategy**: Optimize queries on userId, timestamps, and emotions

### Application Scaling
- **Load Balancing**: Multiple API instances behind load balancer
- **Caching Layer**: Redis for frequently accessed data and analysis results
- **Horizontal Scaling**: Container-based deployment with auto-scaling

## LLM Cost Optimization

### Caching Strategy
- Cache analysis results by text similarity
- Implement TTL (24 hours) for cached results
- Reduces LLM API calls by 60-80%

### Model Optimization
- Use cost-effective models (gemini-3-flash-preview)
- Batch multiple analyses when possible
- Implement rate limiting per user

## Caching Architecture

### Multi-Level Caching
1. **Application Cache**: In-memory cache for recent analyses
2. **Redis Cache**: Distributed cache for analysis results and user insights
3. **CDN Cache**: Cache static API responses where appropriate

### Cache Invalidation
- Time-based expiration (24 hours for analysis)
- Manual invalidation on user updates
- Cache warming for active users

## Data Security Architecture

### Encryption Strategy
- **Data at Rest**: PostgreSQL encryption for sensitive data
- **Data in Transit**: HTTPS/TLS for all API communications
- **PII Protection**: Hash user IDs for analytics

### Access Control
- JWT-based authentication for API access
- Rate limiting per user to prevent abuse
- Input validation and sanitization

### Privacy Protection
- Data anonymization for analysis requests
- GDPR compliance with data deletion capabilities
- Audit logging for sensitive operations

## Performance Optimization

### Database Optimization
- Efficient aggregation queries for insights
- Proper indexing on frequently accessed fields
- Query result pagination for large datasets

### API Optimization
- Async processing for LLM analysis
- Response compression and optimization
- Health checks and monitoring

## Future Enhancements

### Microservices Migration
- Separate Journal, Analysis, and Insights services
- Event-driven architecture for better scalability
- Independent scaling of different components

### Advanced Features
- Real-time insights with WebSocket connections
- Sentiment trend analysis over time
- Personalized mental health recommendations

## Conclusion

This architecture provides a scalable foundation for the AI-Assisted Journal System, balancing performance, cost, and security while supporting growth to 100k+ users.
