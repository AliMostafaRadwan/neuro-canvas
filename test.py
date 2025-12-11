import torch
import torch.nn as nn
import torch.nn.functional as F
from typing import Tuple, Optional

class LanguageModel(nn.Module):
    """
    A neural network model for language modeling using an embedding layer, LSTM, dropout, and a linear output layer.

    Attributes:
        embedding (nn.Embedding): The embedding layer.
        lstm (nn.LSTM): The LSTM layer.
        dropout (nn.Dropout): The dropout layer.
        output (nn.Linear): The linear output layer.
    """

    def __init__(self, num_embeddings: int = 10000, embedding_dim: int = 256, hidden_size: int = 512, num_layers: int = 2, dropout_prob: float = 0.3, output_size: int = 10000) -> None:
        """
        Initializes the LanguageModel with the given parameters.

        Args:
            num_embeddings (int): The number of embeddings. Default is 10000.
            embedding_dim (int): The dimension of the embeddings. Default is 256.
            hidden_size (int): The number of features in the hidden state of the LSTM. Default is 512.
            num_layers (int): The number of recurrent layers. Default is 2.
            dropout_prob (float): The probability of an element to be zeroed in the dropout layer. Default is 0.3.
            output_size (int): The size of the output layer. Default is 10000.
        """
        super(LanguageModel, self).__init__()
        self.embedding = nn.Embedding(num_embeddings=num_embeddings, embedding_dim=embedding_dim)
        self.lstm = nn.LSTM(input_size=embedding_dim, hidden_size=hidden_size, num_layers=num_layers, bidirectional=True, batch_first=True)
        self.dropout = nn.Dropout(p=dropout_prob)
        self.output = nn.Linear(in_features=hidden_size * 2, out_features=output_size)

    def forward(self, x: torch.Tensor, hidden: Optional[Tuple[torch.Tensor, torch.Tensor]] = None) -> Tuple[torch.Tensor, Tuple[torch.Tensor, torch.Tensor]]:
        """
        Defines the forward pass of the model.

        Args:
            x (torch.Tensor): The input tensor.
            hidden (Optional[Tuple[torch.Tensor, torch.Tensor]]): The hidden state and cell state of the LSTM. Default is None.

        Returns:
            Tuple[torch.Tensor, Tuple[torch.Tensor, torch.Tensor]]: The output tensor and the new hidden state and cell state of the LSTM.
        """
        x = self.embedding(x)
        x, hidden = self.lstm(x, hidden)
        x = self.dropout(x)
        x = self.output(x)
        return x, hidden

# Example usage
if __name__ == "__main__":
    # Instantiate the model
    model = LanguageModel()

    # Create a random input tensor
    input_tensor = torch.randint(0, 10000, (32, 10))  # (batch_size, sequence_length)

    # Forward pass
    output, hidden = model(input_tensor)

    print("Output shape:", output.shape)
    print("Hidden state shape:", hidden[0].shape)
    print("Cell state shape:", hidden[1].shape)